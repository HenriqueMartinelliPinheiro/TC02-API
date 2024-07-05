/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Login` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Login` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Login" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Login_userId_key" ON "Login"("userId");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
