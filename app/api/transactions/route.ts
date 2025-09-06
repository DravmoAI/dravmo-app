import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        subscription: {
          include: {
            plan: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to match the frontend interface
    const transformedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      date: transaction.createdAt.toISOString(),
      amount: Number(transaction.amount),
      currency: transaction.currency,
      status: transaction.status,
      description:
        transaction.description ||
        `Payment for ${transaction.subscription?.plan?.name || "Unknown Plan"}`,
      stripePaymentId: transaction.stripePaymentId,
      stripeInvoiceId: transaction.stripeInvoiceId,
    }));

    return NextResponse.json({ transactions: transformedTransactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
