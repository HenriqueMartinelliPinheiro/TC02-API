/*
  Warnings:

  - You are about to drop the column `userPassword` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Login" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "tokenExpiration" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userPassword";
