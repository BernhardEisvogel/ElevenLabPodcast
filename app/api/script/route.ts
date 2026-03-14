import { NextResponse } from "next/server";
import { extractContent } from "@/lib/needle";
import { generateScriptFeatherless } from "@/lib/featherless";
import { getScriptStats, parseScript } from "@/lib/script";

export const runtime = "nodejs";

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = typeof body?.input === "string" ? body.input.trim() : "";

    if (!input) {
      return NextResponse.json(
        { error: "Missing input" },
        { status: 400 }
      );
    }

    const extracted = await extractContent(input);
    const script = await generateScriptFeatherless(extracted);
    const scriptLines = parseScript(script);
    const stats = getScriptStats(scriptLines);

    return NextResponse.json({
      scriptLines,
      debug: {
        extractedPreview: extracted.slice(0, 2500),
        rawScript: script,
        ...stats,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: errorMessage(error) },
      { status: 500 }
    );
  }
}