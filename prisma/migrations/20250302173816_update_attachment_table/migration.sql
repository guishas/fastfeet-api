/*
  Warnings:

  - You are about to drop the column `deliveryId` on the `attachments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_deliveryId_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "deliveryId",
ADD COLUMN     "delivery_id" TEXT;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "deliveries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
