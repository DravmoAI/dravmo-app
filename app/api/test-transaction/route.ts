import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId, subscriptionId, amount, description } = await request.json();

    if (!userId || !subscriptionId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create a test transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        subscriptionId,
        amount: Number(amount),
        currency: "usd",
        status: "succeeded",
        description: description || "Test transaction",
      },
    });

    console.log(`Test transaction created: ${transaction.id}`);

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        description: transaction.description,
      },
    });
  } catch (error) {
    console.error("Error creating test transaction:", error);
    return NextResponse.json({ error: "Failed to create test transaction" }, { status: 500 });
  }
}
