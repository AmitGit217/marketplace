/*
  Warnings:

  - The primary key for the `vehicles` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_vehicleId_fkey";

-- AlterTable
ALTER TABLE "sales" ALTER COLUMN "vehicleId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "vehicles_id_seq";

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
