/*
  Warnings:

  - You are about to drop the column `is_model` on the `plans` table. All the data in the column will be lost.
  - Added the required column `ai_model` to the `plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plans" DROP COLUMN "is_model",
ADD COLUMN     "ai_model" TEXT NOT NULL;
