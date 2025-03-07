/*
  Warnings:

  - Added the required column `user_id` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
