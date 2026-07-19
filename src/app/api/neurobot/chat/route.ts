import { NextRequest } from "next/server";
import { modelsConfig } from "@/app/neurobot/config/models.config";
import { personalitiesConfig } from "@/app/neurobot/config/personalities.config";

export async function POST(req: NextRequest) {
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 20000); // 20-second timeout

  try {
    const { model: modelId, personalityId, messages, attachments } = await req.json();

    const model = modelsConfig.find(m => m.id === modelId) || modelsConfig[0];
    const personality = personalitiesConfig.find(p => p.id === personalityId) || personalitiesConfig[0];

    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    const apiBaseUrl = process.env.GOOGLE_AI_STUDIO_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai";

    if (!apiKey) {
      clearTimeout(timeoutId);
      return new Response(
        JSON.stringify({ error: "GOOGLE_AI_STUDIO_API_KEY is not configured on the server. Please check your environment variables." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Format system prompt as first message
    const formattedMessages = [
      { role: "system", content: personality.systemPrompt },
      ...messages
    ];

    // Format attachments and append to the user's last message
    if (attachments && attachments.length > 0) {
      const lastMessageIndex = formattedMessages.length - 1;
      const lastMessage = { ...formattedMessages[lastMessageIndex] };

      let textAppend = "";
      const imageUrls: any[] = [];

      for (const att of attachments) {
        if (att.type === "file") {
          textAppend += `\n\n[Attached File: ${att.name}]\n\`\`\`\n${att.dataUrl || ""}\n\`\`\``;
        } else if (att.type === "image") {
          if (model.supportsVision) {
            imageUrls.push({
              type: "image_url",
              image_url: { url: att.dataUrl }
            });
          } else {
            textAppend += `\n\n[Attached Image: ${att.name} (Vision not supported by this model)]`;
          }
        }
      }

      if (model.supportsVision && imageUrls.length > 0) {
        lastMessage.content = [
          { type: "text", text: lastMessage.content + textAppend },
          ...imageUrls
        ] as any;
      } else {
        lastMessage.content = lastMessage.content + textAppend;
      }

      formattedMessages[lastMessageIndex] = lastMessage;
    }

    // Call Google AI Studio OpenAI-compatible API
    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model.modelId,
        messages: formattedMessages,
        stream: true,
        max_tokens: model.maxTokens || 8192
      }),
      signal: abortController.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      let errorMessage = errText;
      try {
        const parsedErr = JSON.parse(errText);
        errorMessage = parsedErr.error?.message || parsedErr.message || errText;
      } catch (_) {}

      let friendlyMessage = `Google AI Studio API error: ${errorMessage}`;
      if (response.status === 429) {
        friendlyMessage = "Neurobot rate limit exceeded. Please wait a moment before trying again.";
      } else if (response.status === 401) {
        friendlyMessage = "Neurobot authentication error. Please check server environment variables.";
      }

      return new Response(
        JSON.stringify({ error: friendlyMessage }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        let inThinkBlock = false;
        let pendingBuffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;

              if (trimmed.startsWith("data:")) {
                const dataStr = trimmed.slice(5).trim();
                if (dataStr === "[DONE]") {
                  // Flush any remaining tag buffers
                  if (pendingBuffer) {
                    controller.enqueue(
                      encoder.encode(
                        inThinkBlock
                          ? `event: reasoning_delta\ndata: ${JSON.stringify({ text: pendingBuffer })}\n\n`
                          : `event: content_delta\ndata: ${JSON.stringify({ text: pendingBuffer })}\n\n`
                      )
                    );
                    pendingBuffer = "";
                  }
                  controller.enqueue(encoder.encode("event: done\ndata: [DONE]\n\n"));
                  continue;
                }

                try {
                  const parsed = JSON.parse(dataStr);
                  const delta = parsed.choices?.[0]?.delta;
                  if (!delta) continue;

                  // 1. If provider explicitly sends reasoning_content, use it directly
                  if (delta.reasoning_content) {
                    controller.enqueue(
                      encoder.encode(`event: reasoning_delta\ndata: ${JSON.stringify({ text: delta.reasoning_content })}\n\n`)
                    );
                  }

                  // 2. Stream content_delta, detecting and parsing inline <think>...</think> tags if present
                  if (delta.content) {
                    let text = pendingBuffer + delta.content;
                    pendingBuffer = "";

                    while (text.length > 0) {
                      if (!inThinkBlock) {
                        const index = text.indexOf("<think>");
                        if (index !== -1) {
                          if (index > 0) {
                            controller.enqueue(
                              encoder.encode(`event: content_delta\ndata: ${JSON.stringify({ text: text.slice(0, index) })}\n\n`)
                            );
                          }
                          inThinkBlock = true;
                          text = text.slice(index + "<think>".length);
                          continue;
                        }

                        // Check for partial match of "<think>" at end of text
                        let partialFound = false;
                        const openBracketIndex = text.lastIndexOf("<");
                        if (openBracketIndex !== -1 && openBracketIndex >= text.length - "<think>".length) {
                          const suffix = text.slice(openBracketIndex);
                          if ("<think>".startsWith(suffix)) {
                            if (openBracketIndex > 0) {
                              controller.enqueue(
                                encoder.encode(`event: content_delta\ndata: ${JSON.stringify({ text: text.slice(0, openBracketIndex) })}\n\n`)
                              );
                            }
                            pendingBuffer = suffix;
                            partialFound = true;
                            break;
                          }
                        }

                        if (!partialFound) {
                          controller.enqueue(
                            encoder.encode(`event: content_delta\ndata: ${JSON.stringify({ text })}\n\n`)
                          );
                          break;
                        }
                      } else {
                        const index = text.indexOf("</think>");
                        if (index !== -1) {
                          if (index > 0) {
                            controller.enqueue(
                              encoder.encode(`event: reasoning_delta\ndata: ${JSON.stringify({ text: text.slice(0, index) })}\n\n`)
                            );
                          }
                          inThinkBlock = false;
                          text = text.slice(index + "</think>".length);
                          continue;
                        }

                        // Check for partial match of "</think>" at end of text
                        let partialFound = false;
                        const openBracketIndex = text.lastIndexOf("</");
                        if (openBracketIndex !== -1 && openBracketIndex >= text.length - "</think>".length) {
                          const suffix = text.slice(openBracketIndex);
                          if ("</think>".startsWith(suffix)) {
                            if (openBracketIndex > 0) {
                              controller.enqueue(
                                encoder.encode(`event: reasoning_delta\ndata: ${JSON.stringify({ text: text.slice(0, openBracketIndex) })}\n\n`)
                              );
                            }
                            pendingBuffer = suffix;
                            partialFound = true;
                            break;
                          }
                        }

                        const singleBracketIndex = text.lastIndexOf("<");
                        if (!partialFound && singleBracketIndex !== -1 && singleBracketIndex === text.length - 1) {
                          const suffix = text.slice(singleBracketIndex);
                          if ("</think>".startsWith(suffix)) {
                            if (singleBracketIndex > 0) {
                              controller.enqueue(
                                encoder.encode(`event: reasoning_delta\ndata: ${JSON.stringify({ text: text.slice(0, singleBracketIndex) })}\n\n`)
                              );
                            }
                            pendingBuffer = suffix;
                            partialFound = true;
                            break;
                          }
                        }

                        if (!partialFound) {
                          controller.enqueue(
                            encoder.encode(`event: reasoning_delta\ndata: ${JSON.stringify({ text })}\n\n`)
                          );
                          break;
                        }
                      }
                    }
                  }
                } catch (err) {
                  // Ignore JSON parse errors for incomplete lines
                }
              }
            }
          }
        } catch (streamErr) {
          console.error("Error during streaming response:", streamErr);
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${JSON.stringify({ message: "Streaming connection lost" })}\n\n`)
          );
        } finally {
          if (pendingBuffer) {
            controller.enqueue(
              encoder.encode(
                inThinkBlock
                  ? `event: reasoning_delta\ndata: ${JSON.stringify({ text: pendingBuffer })}\n\n`
                  : `event: content_delta\ndata: ${JSON.stringify({ text: pendingBuffer })}\n\n`
              )
            );
          }
          controller.close();
          reader.releaseLock();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Error in neurobot chat endpoint:", error);
    if (error.name === "AbortError") {
      return new Response(
        JSON.stringify({ error: "The request to Google AI Studio timed out after 20 seconds. Please try again." }),
        {
          status: 504,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
