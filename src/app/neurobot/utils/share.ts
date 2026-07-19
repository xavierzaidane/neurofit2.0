/**
 * Compresses a string using the browser's native CompressionStream (deflate)
 */
async function compressString(str: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(str);
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });
  
  const compressionStream = new CompressionStream("deflate");
  const compressedStream = stream.pipeThrough(compressionStream);
  
  const chunks: Uint8Array[] = [];
  const reader = compressedStream.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  
  // Combine all chunks
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return result;
}

/**
 * Decompresses a Uint8Array using the browser's native DecompressionStream (deflate)
 */
async function decompressBytes(bytes: Uint8Array): Promise<string> {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });
  
  const decompressionStream = new DecompressionStream("deflate");
  const decompressedStream = stream.pipeThrough(decompressionStream);
  
  const chunks: Uint8Array[] = [];
  const reader = decompressedStream.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  
  // Combine all chunks
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return new TextDecoder().decode(result);
}

/**
 * Converts Uint8Array to a URL-safe Base64 string
 */
function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Converts a URL-safe Base64 string back to Uint8Array
 */
function base64UrlToBytes(base64Url: string): Uint8Array {
  let base64 = base64Url
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }
  
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Serializes any data to a compressed URL-safe string
 */
export async function serializeSession(data: any): Promise<string> {
  const jsonStr = JSON.stringify(data);
  const compressed = await compressString(jsonStr);
  return bytesToBase64Url(compressed);
}

/**
 * Deserializes a compressed URL-safe string back to the original data
 */
export async function deserializeSession(payload: string): Promise<any> {
  try {
    const compressedBytes = base64UrlToBytes(payload);
    const jsonStr = await decompressBytes(compressedBytes);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to deserialize session payload:", error);
    throw new Error("Invalid or corrupted share URL payload.");
  }
}
