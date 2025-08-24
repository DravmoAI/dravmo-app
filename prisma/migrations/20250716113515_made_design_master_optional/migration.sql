-- DropForeignKey
ALTER TABLE "feedback_queries" DROP CONSTRAINT "feedback_queries_design_master_id_fkey";

-- AlterTable
ALTER TABLE "feedback_queries" ALTER COLUMN "design_master_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "feedback_queries" ADD CONSTRAINT "feedback_queries_design_master_id_fkey" FOREIGN KEY ("design_master_id") REFERENCES "design_masters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
