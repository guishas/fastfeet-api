-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_delivererId_fkey";

-- AlterTable
ALTER TABLE "deliveries" ALTER COLUMN "delivererId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_delivererId_fkey" FOREIGN KEY ("delivererId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
