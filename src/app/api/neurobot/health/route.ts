import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { status: "error", message: "GOOGLE_AI_STUDIO_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    status: "ok",
    provider: "google-ai-studio",
    keyPresent: true,
    keyLength: apiKey.length
  });
}
