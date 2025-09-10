/*
  Warnings:

  - You are about to drop the column `price` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_price_id` on the `plans` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `plan_price_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_plan_id_fkey";

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "price",
DROP COLUMN "stripe_price_id",
ADD COLUMN     "stripe_product_id" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "plan_id",
ADD COLUMN     "plan_price_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "plan_prices" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "stripe_price_id" TEXT NOT NULL,
    "billing_interval" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "plan_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_prices_stripe_price_id_key" ON "plan_prices"("stripe_price_id");

-- AddForeignKey
ALTER TABLE "plan_prices" ADD CONSTRAINT "plan_prices_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_price_id_fkey" FOREIGN KEY ("plan_price_id") REFERENCES "plan_prices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
