import { PrismaClient } from "@prisma/client";
import { UserFeatureService, UserFeatures } from "./user-features";

const prisma = new PrismaClient();

export interface PlanRestrictions {
  maxProjects: number;
  maxQueries: number;
  figmaIntegration: boolean;
  masterMode: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  customBranding: boolean;
  exportToPDF: boolean;
  premiumAnalyzers: string[];
  aiModel: string;
}

export interface UsageStats {
  currentProjects: number;
  currentQueries: number;
  remainingProjects: number;
  remainingQueries: number;
}

export class PlanRestrictionsService {
  /**
   * Get user plan restrictions and current usage
   */
  static async getUserPlanInfo(userId: string): Promise<{
    restrictions: PlanRestrictions;
    usage: UsageStats;
    planName: string;
  }> {
    // Get user features (includes overrides)
    const features = await UserFeatureService.getUserFeatures(userId);

    // Get current usage
    const usage = await this.getUserUsage(userId);

    // Get plan name
    const subscription = await prisma.subscription.findFirst({
      where: { userId, status: "active" },
      include: {
        planPrice: {
          include: { plan: true },
        },
      },
    });

    const planName = subscription?.planPrice.plan.name || "Free";

    return {
      restrictions: {
        maxProjects: features.maxProjects,
        maxQueries: features.maxQueries,
        figmaIntegration: features.figmaIntegration,
        masterMode: features.masterMode,
        prioritySupport: features.prioritySupport,
        advancedAnalytics: features.advancedAnalytics,
        customBranding: features.customBranding,
        exportToPDF: features.exportToPDF,
        premiumAnalyzers: features.premiumAnalyzers,
        aiModel: features.aiModel,
      },
      usage,
      planName,
    };
  }

  /**
   * Get current user usage statistics
   */
  static async getUserUsage(userId: string): Promise<UsageStats> {
    // Count user projects
    const currentProjects = await prisma.project.count({
      where: { userId },
    });

    // Count user feedback queries for this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const currentQueries = await prisma.feedbackQuery.count({
      where: {
        screen: {
          project: {
            userId,
          },
        },
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get user features to determine limits
    const features = await UserFeatureService.getUserFeatures(userId);

    const remainingProjects =
      features.maxProjects === -1 ? -1 : Math.max(0, features.maxProjects - currentProjects);

    const remainingQueries =
      features.maxQueries === -1 ? -1 : Math.max(0, features.maxQueries - currentQueries);

    return {
      currentProjects,
      currentQueries,
      remainingProjects,
      remainingQueries,
    };
  }

  /**
   * Check if user can create a new project
   */
  static async canCreateProject(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  }> {
    const { restrictions, usage } = await this.getUserPlanInfo(userId);

    // Unlimited plans
    if (restrictions.maxProjects === -1) {
      return { allowed: true };
    }

    // Check if user has reached limit
    if (usage.currentProjects >= restrictions.maxProjects) {
      return {
        allowed: false,
        reason: `You have reached your project limit of ${restrictions.maxProjects}. Upgrade your plan to create more projects.`,
        upgradeRequired: true,
      };
    }

    return { allowed: true };
  }

  /**
   * Check if user can create a new feedback query
   */
  static async canCreateFeedbackQuery(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  }> {
    const { restrictions, usage } = await this.getUserPlanInfo(userId);

    // Unlimited plans
    if (restrictions.maxQueries === -1) {
      return { allowed: true };
    }

    // Check if user has reached limit
    if (usage.currentQueries >= restrictions.maxQueries) {
      return {
        allowed: false,
        reason: `You have reached your monthly query limit of ${restrictions.maxQueries}. Upgrade your plan for unlimited queries.`,
        upgradeRequired: true,
      };
    }

    return { allowed: true };
  }

  /**
   * Check if user can use a specific analyzer
   */
  static async canUseAnalyzer(
    userId: string,
    analyzerName: string
  ): Promise<{
    allowed: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  }> {
    const { restrictions } = await this.getUserPlanInfo(userId);

    // Free analyzers (always allowed)
    const freeAnalyzers = ["Layout & Structure", "Typography", "Color & Visual Design"];

    if (freeAnalyzers.includes(analyzerName)) {
      return { allowed: true };
    }

    // Check if analyzer is in premium list
    if (restrictions.premiumAnalyzers.includes(analyzerName)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `${analyzerName} is a premium analyzer. Upgrade your plan to access premium analyzers.`,
      upgradeRequired: true,
    };
  }

  /**
   * Check if user can use Figma integration
   */
  static async canUseFigmaIntegration(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  }> {
    const { restrictions } = await this.getUserPlanInfo(userId);

    if (restrictions.figmaIntegration) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason:
        "Figma integration is not available on your current plan. Upgrade to Lite or Pro to access this feature.",
      upgradeRequired: true,
    };
  }

  /**
   * Check if user can use Master mode
   */
  static async canUseMasterMode(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  }> {
    const { restrictions } = await this.getUserPlanInfo(userId);

    if (restrictions.masterMode) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason:
        "Master mode is not available on your current plan. Upgrade to Lite or Pro to access this feature.",
      upgradeRequired: true,
    };
  }

  /**
   * Check if user can export to PDF
   */
  static async canExportToPDF(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  }> {
    const { restrictions } = await this.getUserPlanInfo(userId);

    if (restrictions.exportToPDF) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason:
        "PDF export is not available on your current plan. Upgrade to Lite or Pro to access this feature.",
      upgradeRequired: true,
    };
  }

  /**
   * Get available analyzers for user
   */
  static async getAvailableAnalyzers(userId: string): Promise<string[]> {
    const { restrictions } = await this.getUserPlanInfo(userId);

    const freeAnalyzers = ["Layout & Structure", "Typography", "Color & Visual Design"];

    return [...freeAnalyzers, ...restrictions.premiumAnalyzers];
  }
}
