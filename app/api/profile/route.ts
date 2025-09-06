import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, fullName } = body;

    // Find the free plan
    const freePlan = await prisma.plan.findFirst({
      where: {
        OR: [{ name: "Free" }, { name: "free" }, { price: 0 }],
      },
    });

    if (!freePlan) {
      return NextResponse.json({ error: "Free plan not found" }, { status: 500 });
    }

    // Create profile and subscription in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create profile
      const profile = await tx.profile.create({
        data: {
          id,
          email,
          fullName,
        },
      });

      // Create subscription for free plan
      const subscription = await tx.subscription.create({
        data: {
          planId: freePlan.id,
          userId: id,
          stripeSubId: null, // Free plan doesn't need Stripe subscription ID
          autoRenew: false, // Free plan doesn't auto-renew
          status: "active",
        },
      });

      return { profile, subscription };
    });

    return NextResponse.json({ profile: result.profile }, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, fullName, avatarUrl } = body;

    // Update profile
    const profile = await prisma.profile.update({
      where: { id },
      data: {
        fullName,
        avatarUrl,
      },
    });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
