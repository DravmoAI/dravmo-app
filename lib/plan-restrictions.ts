import { prisma } from "@/lib/prisma";

export interface PlanRestrictions {
  maxProjects: number;
  maxQueriesPerMonth: number;
  canUseMasterMode: boolean;
  canUsePremiumAnalyzers: boolean;
  canUseFigmaIntegration: boolean;
}

export interface UsageStats {
  currentProjects: number;
  currentQueriesThisMonth: number;
  remainingProjects: number;
  remainingQueries: number;
}

/**
 * Get user's current plan restrictions
 */
export async function getUserPlanRestrictions(userId: string): Promise<PlanRestrictions> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "active",
    },
    include: {
      plan: true,
      subscriptionFeatures: {
        include: {
          feature: true,
        },
      },
    },
  });

  if (!subscription) {
    // Default to free plan restrictions if no subscription found
    return {
      maxProjects: 3,
      maxQueriesPerMonth: 20,
      canUseMasterMode: false,
      canUsePremiumAnalyzers: false,
      canUseFigmaIntegration: false,
    };
  }

  const plan = subscription.plan;
  const features = subscription.subscriptionFeatures;

  console.log(plan, features);

  // Make Lite and Pro plans truly unlimited for projects
  const isUnlimitedPlan = plan.name?.toLowerCase() === "lite" || plan.name?.toLowerCase() === "pro";

  return {
    maxProjects: isUnlimitedPlan ? -1 : plan.maxProjects, // -1 means unlimited
    maxQueriesPerMonth: plan.maxQueries,
    canUseMasterMode: features.some((f: any) => f.feature.slug === "master-mode" && f.isEnabled),
    canUsePremiumAnalyzers: features.some((f: any) => f.feature.isPremium && f.isEnabled),
    canUseFigmaIntegration: features.some(
      (f: any) => f.feature.slug === "figma-integration" && f.isEnabled
    ),
  };
}

/**
 * Get user's current usage statistics
 */
export async function getUserUsageStats(userId: string): Promise<UsageStats> {
  // Count current projects
  const currentProjects = await prisma.project.count({
    where: { userId },
  });

  // Count queries this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const currentQueriesThisMonth = await prisma.feedbackQuery.count({
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

  // Get plan restrictions
  const restrictions = await getUserPlanRestrictions(userId);

  return {
    currentProjects,
    currentQueriesThisMonth,
    remainingProjects: Math.max(0, restrictions.maxProjects - currentProjects),
    remainingQueries: Math.max(0, restrictions.maxQueriesPerMonth - currentQueriesThisMonth),
  };
}

/**
 * Check if user can create a new project
 */
export async function canCreateProject(
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const restrictions = await getUserPlanRestrictions(userId);

  // If user has unlimited projects (Lite/Pro plans), always allow
  if (restrictions.maxProjects === -1) {
    return { allowed: true };
  }

  const usage = await getUserUsageStats(userId);

  if (usage.remainingProjects <= 0) {
    return {
      allowed: false,
      reason: `You've reached your project limit of ${usage.currentProjects} projects. Upgrade your plan to create more projects.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can create a new feedback query
 */
export async function canCreateFeedbackQuery(
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const usage = await getUserUsageStats(userId);

  if (usage.remainingQueries <= 0) {
    return {
      allowed: false,
      reason: `You've reached your monthly query limit of ${usage.currentQueriesThisMonth} queries. Upgrade your plan for more queries.`,
    };
  }

  return { allowed: true };
}

/**
 * Check if user can use master mode
 */
export async function canUseMasterMode(
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const restrictions = await getUserPlanRestrictions(userId);

  if (!restrictions.canUseMasterMode) {
    return {
      allowed: false,
      reason: "Master mode is only available on paid plans. Upgrade to access this feature.",
    };
  }

  return { allowed: true };
}

/**
 * Check if user can use premium analyzers
 */
export async function canUsePremiumAnalyzers(
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const restrictions = await getUserPlanRestrictions(userId);

  if (!restrictions.canUsePremiumAnalyzers) {
    return {
      allowed: false,
      reason: "Premium analyzers are only available on paid plans. Upgrade to access this feature.",
    };
  }

  return { allowed: true };
}

/**
 * Get available analyzer topics for a user based on their plan
 */
export async function getAvailableAnalyzerTopics(userId: string) {
  const restrictions = await getUserPlanRestrictions(userId);

  // Import prisma here to avoid circular dependencies
  const { prisma } = await import("@/lib/prisma");

  const whereClause = restrictions.canUsePremiumAnalyzers
    ? {} // Show all topics for premium users
    : { tier: "free" }; // Only show free topics for free users

  const topics = await prisma.analyzerTopic.findMany({
    where: whereClause,
    include: {
      analyzerSubtopics: {
        include: {
          analyzerPoints: true,
        },
      },
    },
    orderBy: {
      tier: "asc", // Free topics first
    },
  });

  console.log(
    `User ${userId} can access ${topics.length} analyzer topics (premium: ${restrictions.canUsePremiumAnalyzers})`
  );
  console.log(
    `Available topics:`,
    topics.map((t: any) => `${t.name} (${t.tier})`)
  );

  return topics;
}

/**
 * Check if user can use Figma integration
 */
export async function canUseFigmaIntegration(
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const restrictions = await getUserPlanRestrictions(userId);

  if (!restrictions.canUseFigmaIntegration) {
    return {
      allowed: false,
      reason: "Figma integration is only available on paid plans. Upgrade to access this feature.",
    };
  }

  return { allowed: true };
}

/**
 * Get all plan restrictions and usage for a user
 */
export async function getUserPlanInfo(userId: string) {
  const restrictions = await getUserPlanRestrictions(userId);
  const usage = await getUserUsageStats(userId);

  return {
    restrictions,
    usage,
  };
}
