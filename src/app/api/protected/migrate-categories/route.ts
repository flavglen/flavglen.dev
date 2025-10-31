import { NextRequest, NextResponse } from "next/server";
import { migrateExpenseCategories } from "@/lib/migrate-expense-categories";

/**
 * API route to run expense category migration
 * 
 * Query parameters:
 * - dryRun: boolean (default: false) - If true, only analyze without updating
 * - syncPeriodData: boolean (default: true) - If true, sync period data after migration
 * - fromDate: string (optional) - ISO date string for start date
 * - toDate: string (optional) - ISO date string for end date
 * - collectionName: string (default: "ai_expenses") - Collection name to migrate
 * 
 * Example:
 * GET /api/protected/migrate-categories?dryRun=true
 * POST /api/protected/migrate-categories?syncPeriodData=false&fromDate=2024-01-01&toDate=2024-12-31&collectionName=ai_expenses_test
 */
export async function GET(req: NextRequest) {
  try {
    // Authentication and admin check are handled by middleware for /api/protected/* routes
    // No need to duplicate checks here
    
    const searchParams = req.nextUrl.searchParams;
    const dryRun = searchParams.get("dryRun") === "true";
    const syncPeriodData = searchParams.get("syncPeriodData") !== "false"; // default true
    const fromDate = searchParams.get("fromDate") || undefined;
    const toDate = searchParams.get("toDate") || undefined;
    const collectionName = searchParams.get("collectionName") || "ai_expenses";

    console.log(`Starting migration: collection=${collectionName}, dryRun=${dryRun}, syncPeriodData=${syncPeriodData}, fromDate=${fromDate}, toDate=${toDate}`);

    const result = await migrateExpenseCategories({
      dryRun,
      syncPeriodData,
      fromDate,
      toDate,
      collectionName,
    });

    return NextResponse.json({
      success: result.success,
      message: dryRun
        ? "Migration analysis completed (DRY RUN)"
        : "Migration completed successfully",
      results: {
        totalExpenses: result.totalExpenses,
        updatedExpenses: result.updatedExpenses,
        unchangedExpenses: result.unchangedExpenses,
        errors: result.errors,
        updatedExpensesDetails: result.updatedExpensesDetails,
        errorsDetails: result.errorsDetails,
      },
    });
  } catch (error: any) {
    console.error("Migration API error:", error);
    return NextResponse.json(
      {
        error: "Migration failed",
        message: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Same as GET, but can accept body parameters if needed in the future
  try {
    // Authentication and admin check are handled by middleware for /api/protected/* routes
    // No need to duplicate checks here
    
    const searchParams = req.nextUrl.searchParams;
    const dryRun = searchParams.get("dryRun") === "true";
    const syncPeriodData = searchParams.get("syncPeriodData") !== "false"; // default true
    const fromDate = searchParams.get("fromDate") || undefined;
    const toDate = searchParams.get("toDate") || undefined;
    const collectionName = searchParams.get("collectionName") || "ai_expenses";

    console.log(`Starting migration: collection=${collectionName}, dryRun=${dryRun}, syncPeriodData=${syncPeriodData}, fromDate=${fromDate}, toDate=${toDate}`);

    const result = await migrateExpenseCategories({
      dryRun,
      syncPeriodData,
      fromDate,
      toDate,
      collectionName,
    });

    return NextResponse.json({
      success: result.success,
      message: dryRun
        ? "Migration analysis completed (DRY RUN)"
        : "Migration completed successfully",
      results: {
        totalExpenses: result.totalExpenses,
        updatedExpenses: result.updatedExpenses,
        unchangedExpenses: result.unchangedExpenses,
        errors: result.errors,
        updatedExpensesDetails: result.updatedExpensesDetails,
        errorsDetails: result.errorsDetails,
      },
    });
  } catch (error: any) {
    console.error("Migration API error:", error);
    return NextResponse.json(
      {
        error: "Migration failed",
        message: error.message || String(error),
      },
      { status: 500 }
    );
  }
}

