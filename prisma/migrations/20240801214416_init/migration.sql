/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Login` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpiration` on the `Login` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Login" DROP COLUMN "refreshToken",
DROP COLUMN "refreshTokenExpiration";
