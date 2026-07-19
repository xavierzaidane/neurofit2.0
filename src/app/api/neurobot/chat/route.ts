import { NextRequest } from "next/server";
import { modelsConfig } from "@/app/neurobot/config/models.config";
import { personalitiesConfig } from "@/app/neurobot/config/personalities.config";

export async function POST(req: NextRequest) {
  try {
    const { model: modelId, personalityId, messages, attachments } = await req.json();

    const model = modelsConfig.find(m => m.id === modelId) || modelsConfig[0];
    const personality = personalitiesConfig.find(p => p.id === personalityId) || personalitiesConfig[0];

    const apiKey = process.env.NVIDIA_API_KEY;
    const apiBaseUrl = process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "NVIDIA_API_KEY is not configured on the server. Please check your environment variables." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Map model ID to nvidiaModelId
    let nvidiaModelId = model.nvidiaModelId;
    if (nvidiaModelId === "minimax/minimax-m2.7-chat") {
      nvidiaModelId = "minimaxai/minimax-m2.7";
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

    // Call NVIDIA API
    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: nvidiaModelId,
        messages: formattedMessages,
        stream: true,
        max_tokens: model.maxTokens || 4096
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: `NVIDIA API error: ${response.status} - ${errText}` }),
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
                  controller.enqueue(encoder.encode("event: done\ndata: [DONE]\n\n"));
                  continue;
                }

                try {
                  const parsed = JSON.parse(dataStr);
                  const delta = parsed.choices?.[0]?.delta;
                  if (!delta) continue;

                  if (delta.reasoning_content) {
                    controller.enqueue(
                      encoder.encode(`event: reasoning_delta\ndata: ${JSON.stringify({ text: delta.reasoning_content })}\n\n`)
                    );
                  }
                  
                  if (delta.content) {
                    controller.enqueue(
                      encoder.encode(`event: content_delta\ndata: ${JSON.stringify({ text: delta.content })}\n\n`)
                    );
                  }
                } catch (err) {
                  // Ignore JSON parse errors for incomplete lines or safety blocks
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
    console.error("Error in neurobot chat endpoint:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
