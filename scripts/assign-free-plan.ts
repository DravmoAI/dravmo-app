import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
	console.log("Assigning Free plan to all users...")

	// Find the Free plan price (prefer explicit stripePriceId if present)
	const freePlanPrice = await prisma.planPrice.findFirst({
		where: {
			OR: [
				{ stripePriceId: "free_plan" },
				{
					amount: 0,
					isActive: true,
					plan: { name: "Free" },
				},
			],
		},
	})

	if (!freePlanPrice) {
		console.error(
			"Free plan price not found. Seed plans first (e.g., run scripts/seed-plans.ts).",
		)
		process.exit(1)
	}

	const profiles = await prisma.profile.findMany({ select: { id: true, email: true } })
	console.log(`Found ${profiles.length} profiles`)

	let createdCount = 0
	let updatedCount = 0

	for (const profile of profiles) {
		const existingSubs = await prisma.subscription.findMany({
			where: { userId: profile.id },
			select: { id: true, planPriceId: true },
		})

		if (existingSubs.length === 0) {
			await prisma.subscription.create({
				data: {
					userId: profile.id,
					planPriceId: freePlanPrice.id,
					stripeSubId: null,
					autoRenew: false,
					status: "active",
				},
			})
			createdCount += 1
			continue
		}

		// Normalize all existing subscriptions to Free
		await prisma.subscription.updateMany({
			where: { userId: profile.id },
			data: {
				planPriceId: freePlanPrice.id,
				stripeSubId: null,
				autoRenew: false,
				status: "active",
			},
		})
		updatedCount += 1
	}

	console.log(
		`Done. Created ${createdCount} subscriptions and updated ${updatedCount} user(s).`,
	)
}

main()
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})


