/*
  Warnings:

  - You are about to drop the column `activityEndDate` on the `EventActivity` table. All the data in the column will be lost.
  - You are about to drop the column `activityStartDate` on the `EventActivity` table. All the data in the column will be lost.
  - Added the required column `eventActivityDescription` to the `EventActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventActivityEndDate` to the `EventActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventActivityStartDate` to the `EventActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventActivity" DROP COLUMN "activityEndDate",
DROP COLUMN "activityStartDate",
ADD COLUMN     "eventActivityDescription" TEXT NOT NULL,
ADD COLUMN     "eventActivityEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "eventActivityStartDate" TIMESTAMP(3) NOT NULL;
