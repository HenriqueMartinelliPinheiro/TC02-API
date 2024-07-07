/*
  Warnings:

  - You are about to drop the column `tokenExpiration` on the `Login` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Login" DROP COLUMN "tokenExpiration",
ADD COLUMN     "accessTokenExpiration" TIMESTAMP(3);
