
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface UserFeatures {
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

export class UserFeatureService {
  static async getUserFeatures(userId: string): Promise<UserFeatures> {
    const subscription = await prisma.subscription.findFirst({
      where: { userId, status: "active" },
      include: {
        planPrice: {
          include: { plan: true }
        }
      }
    });

    // Default free plan features for users without subscriptions
    const defaultFreePlan = {
      maxProjects: 3,
      maxQueries: 10,
      figmaIntegration: false,
      masterMode: false,
      prioritySupport: false,
      advancedAnalytics: false,
      customBranding: false,
      exportToPDF: false,
      premiumAnalyzers: [],
      aiModel: "gpt-3.5-turbo"
    };

    const plan = subscription?.planPrice.plan || defaultFreePlan;
    
    const overrides = await prisma.userFeatureOverride.findMany({
      where: { 
        userId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });

    const overrideMap = new Map();
    overrides.forEach(override => {
      try {
        overrideMap.set(override.feature, JSON.parse(override.value));
      } catch (error) {
        console.error(`Error parsing override value for ${override.feature}:`, error);
      }
    });

    return {
      maxProjects: overrideMap.get("maxProjects") ?? plan.maxProjects,
      maxQueries: overrideMap.get("maxQueries") ?? plan.maxQueries,
      figmaIntegration: overrideMap.get("figmaIntegration") ?? plan.figmaIntegration,
      masterMode: overrideMap.get("masterMode") ?? plan.masterMode,
      prioritySupport: overrideMap.get("prioritySupport") ?? plan.prioritySupport,
      advancedAnalytics: overrideMap.get("advancedAnalytics") ?? plan.advancedAnalytics,
      customBranding: overrideMap.get("customBranding") ?? plan.customBranding,
      exportToPDF: overrideMap.get("exportToPDF") ?? plan.exportToPDF,
      premiumAnalyzers: overrideMap.get("premiumAnalyzers") ?? plan.premiumAnalyzers,
      aiModel: overrideMap.get("aiModel") ?? plan.aiModel ?? "gpt-3.5-turbo",
    };
  }

  static async grantFeatureOverride(
    userId: string, 
    feature: string, 
    value: any, 
    reason?: string,
    expiresAt?: Date
  ) {
    return await prisma.userFeatureOverride.upsert({
      where: {
        userId_feature: { userId, feature }
      },
      update: {
        value: JSON.stringify(value),
        reason,
        expiresAt
      },
      create: {
        userId,
        feature,
        value: JSON.stringify(value),
        reason,
        expiresAt
      }
    });
  }
}
