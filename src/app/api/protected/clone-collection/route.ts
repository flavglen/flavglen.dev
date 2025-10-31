import { NextRequest, NextResponse } from "next/server";
import { cloneCollection } from "@/lib/clone-collection";
/**
 * API route to clone a Firestore collection
 * 
 * Query parameters:
 * - sourceCollection: string (required) - Source collection name
 * - targetCollection: string (required) - Target collection name
 * - overwrite: boolean (default: false) - If true, overwrite existing documents
 * 
 * Example:
 * POST /api/protected/clone-collection?sourceCollection=ai_expenses&targetCollection=ai_expenses_test
 */
export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sourceCollection = searchParams.get("sourceCollection");
    const targetCollection = searchParams.get("targetCollection");
    const overwrite = searchParams.get("overwrite") === "true";

    if (!sourceCollection || !targetCollection) {
      return NextResponse.json(
        { error: "Missing required parameters: sourceCollection and targetCollection" },
        { status: 400 }
      );
    }

    // Prevent cloning to the same collection
    if (sourceCollection === targetCollection) {
      return NextResponse.json(
        { error: "Source and target collections cannot be the same" },
        { status: 400 }
      );
    }

    console.log(`Starting clone: ${sourceCollection} -> ${targetCollection}, overwrite=${overwrite}`);

    const result = await cloneCollection(sourceCollection, targetCollection, {
      overwrite,
    });

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Successfully cloned ${result.documentsCopied} documents from ${sourceCollection} to ${targetCollection}`
        : `Clone completed with ${result.errors} errors`,
      results: {
        sourceCollection: result.sourceCollection,
        targetCollection: result.targetCollection,
        documentsCopied: result.documentsCopied,
        errors: result.errors,
        errorDetails: result.errorDetails,
      },
    });
  } catch (error: any) {
    console.error("Clone collection API error:", error);
    return NextResponse.json(
      {
        error: "Clone collection failed",
        message: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

