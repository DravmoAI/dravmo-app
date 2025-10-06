import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get user subscription
    const subscription = await prisma.subscription.findFirst({
      where: { userId, status: "active" },
      include: {
        planPrice: {
          include: {
            plan: true,
          },
        },
      },
    });

    // Get user transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      subscription,
      transactions,
      message: "Webhook test data retrieved successfully",
    }, { status: 200 });
  } catch (error) {
    console.error("Error in test webhook:", error);
    return NextResponse.json({ error: "Failed to test webhook" }, { status: 500 });
  }
}
