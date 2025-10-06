import { NextRequest, NextResponse } from "next/server";
import { PlanRestrictionsService } from "@/lib/services/plan-restrictions";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Test all plan restriction methods
    const planInfo = await PlanRestrictionsService.getUserPlanInfo(userId);
    const canCreateProject = await PlanRestrictionsService.canCreateProject(userId);
    const canCreateQuery = await PlanRestrictionsService.canCreateFeedbackQuery(userId);
    const canUseFigma = await PlanRestrictionsService.canUseFigmaIntegration(userId);
    const canUseMaster = await PlanRestrictionsService.canUseMasterMode(userId);
    const canExportPDF = await PlanRestrictionsService.canExportToPDF(userId);
    const availableAnalyzers = await PlanRestrictionsService.getAvailableAnalyzers(userId);

    return NextResponse.json({
      planInfo,
      restrictions: {
        canCreateProject,
        canCreateQuery,
        canUseFigma,
        canUseMaster,
        canExportPDF,
        availableAnalyzers,
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error testing plan restrictions:", error);
    return NextResponse.json({ error: "Failed to test plan restrictions" }, { status: 500 });
  }
}
