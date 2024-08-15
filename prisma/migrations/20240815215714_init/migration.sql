/*
  Warnings:

  - You are about to drop the column `eventPeriodId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the `EventPeriod` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventActivityId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_eventPeriodId_fkey";

-- DropForeignKey
ALTER TABLE "EventPeriod" DROP CONSTRAINT "EventPeriod_eventId_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "eventPeriodId",
ADD COLUMN     "eventActivityId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "EventPeriod";

-- CreateTable
CREATE TABLE "EventActivity" (
    "eventActivityId" SERIAL NOT NULL,
    "activityStartDate" TIMESTAMP(3) NOT NULL,
    "activityEndDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventActivity_pkey" PRIMARY KEY ("eventActivityId")
);

-- AddForeignKey
ALTER TABLE "EventActivity" ADD CONSTRAINT "EventActivity_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventActivityId_fkey" FOREIGN KEY ("eventActivityId") REFERENCES "EventActivity"("eventActivityId") ON DELETE RESTRICT ON UPDATE CASCADE;
