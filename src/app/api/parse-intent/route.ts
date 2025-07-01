import { NextRequest, NextResponse } from "next/server";
import { parseIntentWithOpenAI } from "@/utils/openai";

export async function POST(req: NextRequest) {
  try {
    const { intent } = await req.json();
    if (!intent) {
      return NextResponse.json({ error: "Missing intent" }, { status: 400 });
    }
    const rule = await parseIntentWithOpenAI(intent);
    return NextResponse.json({ rule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
} 