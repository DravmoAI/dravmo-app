/*
  Warnings:

  - You are about to drop the column `bio` on the `design_masters` table. All the data in the column will be lost.
  - You are about to drop the column `style_summary` on the `design_masters` table. All the data in the column will be lost.
  - You are about to drop the column `userful_for` on the `design_masters` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "design_masters" DROP COLUMN "bio",
DROP COLUMN "style_summary",
DROP COLUMN "userful_for",
ADD COLUMN     "fit_summary" TEXT,
ADD COLUMN     "methodology" TEXT[],
ADD COLUMN     "philosophy" TEXT,
ADD COLUMN     "signature_gestures" TEXT[],
ALTER COLUMN "avatar_url" DROP NOT NULL;

-- CreateTable
CREATE TABLE "talks" (
    "id" TEXT NOT NULL,
    "design_master_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "talks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "design_master_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "talks" ADD CONSTRAINT "talks_design_master_id_fkey" FOREIGN KEY ("design_master_id") REFERENCES "design_masters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_design_master_id_fkey" FOREIGN KEY ("design_master_id") REFERENCES "design_masters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
