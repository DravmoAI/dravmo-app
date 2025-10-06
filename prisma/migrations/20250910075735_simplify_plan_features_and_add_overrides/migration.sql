/*
  Warnings:

  - You are about to drop the `features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `plan_features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscription_features` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "plan_features" DROP CONSTRAINT "plan_features_feature_id_fkey";

-- DropForeignKey
ALTER TABLE "plan_features" DROP CONSTRAINT "plan_features_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription_features" DROP CONSTRAINT "subscription_features_feature_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription_features" DROP CONSTRAINT "subscription_features_subscription_id_fkey";

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "advanced_analytics" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "custom_branding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "export_to_pdf" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "figma_integration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "master_mode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "premium_analyzers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "priority_support" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "features";

-- DropTable
DROP TABLE "plan_features";

-- DropTable
DROP TABLE "subscription_features";

-- CreateTable
CREATE TABLE "user_feature_overrides" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "reason" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_feature_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_feature_overrides_user_id_feature_key" ON "user_feature_overrides"("user_id", "feature");

-- AddForeignKey
ALTER TABLE "user_feature_overrides" ADD CONSTRAINT "user_feature_overrides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
