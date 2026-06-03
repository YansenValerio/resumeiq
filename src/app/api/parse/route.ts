import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { parseResume, type ParseError } from "@/lib/parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const result = await parseResume(file);

    return NextResponse.json({
      success: true,
      data: {
        text: result.text,
        wordCount: result.wordCount,
        characterCount: result.characterCount,
        pageCount: result.pageCount,
      },
    });
  } catch (error) {
    const parseError = error as ParseError;

    // Handle known parse errors
    if (parseError.code) {
      const statusMap: Record<string, number> = {
        INVALID_FORMAT: 400,
        FILE_TOO_LARGE: 413,
        PARSE_FAILED: 422,
        EMPTY_CONTENT: 422,
      };

      return NextResponse.json(
        {
          error: parseError.message,
          code: parseError.code,
        },
        { status: statusMap[parseError.code] || 500 }
      );
    }

    console.error("Parse API error:", error);
    Sentry.captureException(error, { tags: { route: "api/parse" } });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
