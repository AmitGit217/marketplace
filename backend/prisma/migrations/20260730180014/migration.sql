/*
  Warnings:

  - The primary key for the `vehicles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `vehicles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `vehicleId` on the `sales` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_vehicleId_fkey";

-- AlterTable
CREATE SEQUENCE sales_id_seq;
ALTER TABLE "sales" ALTER COLUMN "id" SET DEFAULT nextval('sales_id_seq'),
DROP COLUMN "vehicleId",
ADD COLUMN     "vehicleId" INTEGER NOT NULL;
ALTER SEQUENCE sales_id_seq OWNED BY "sales"."id";

-- AlterTable
CREATE SEQUENCE users_id_seq;
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq');
ALTER SEQUENCE users_id_seq OWNED BY "users"."id";

-- AlterTable
ALTER TABLE "vehicles" DROP CONSTRAINT "vehicles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_vehicleId_key" ON "sales"("vehicleId");

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
