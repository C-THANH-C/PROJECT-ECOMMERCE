/*
  Warnings:

  - The primary key for the `store_info` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address_id` on the `store_info` table. All the data in the column will be lost.
  - The primary key for the `user_info` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address_id` on the `user_info` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "store_info" DROP CONSTRAINT "store_info_address_id_fkey";

-- DropForeignKey
ALTER TABLE "user_info" DROP CONSTRAINT "user_info_address_id_fkey";

-- AlterTable
ALTER TABLE "address" ADD COLUMN     "store_id" INTEGER,
ADD COLUMN     "user_id" INTEGER;

-- AlterTable
ALTER TABLE "store_info" DROP CONSTRAINT "store_info_pkey",
DROP COLUMN "address_id",
ADD CONSTRAINT "store_info_pkey" PRIMARY KEY ("store_id");

-- AlterTable
ALTER TABLE "user_info" DROP CONSTRAINT "user_info_pkey",
DROP COLUMN "address_id",
ADD CONSTRAINT "user_info_pkey" PRIMARY KEY ("user_id");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_info"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("store_id") ON DELETE CASCADE ON UPDATE NO ACTION;
