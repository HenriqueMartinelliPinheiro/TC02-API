/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Event` table. All the data in the column will be lost.
  - Added the required column `eventEndDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventStartDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventStatus` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eventEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "eventId" SERIAL NOT NULL,
ADD COLUMN     "eventStartDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "eventStatus" VARCHAR(25) NOT NULL,
ADD COLUMN     "title" VARCHAR(255) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId");

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "systemStatus" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "EventLocation" (
    "eventLocationId" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventLocation_pkey" PRIMARY KEY ("eventLocationId")
);

-- CreateTable
CREATE TABLE "EventPeriod" (
    "eventPeriodId" SERIAL NOT NULL,
    "periodStartDate" TIMESTAMP(3) NOT NULL,
    "periodEndDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventPeriod_pkey" PRIMARY KEY ("eventPeriodId")
);

-- CreateTable
CREATE TABLE "EventCourse" (
    "eventCourseId" SERIAL NOT NULL,
    "courseName" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventCourse_pkey" PRIMARY KEY ("eventCourseId")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "AttendanceId" SERIAL NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentRegistration" TEXT NOT NULL,
    "eventPeriodId" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("AttendanceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventLocation_eventId_key" ON "EventLocation"("eventId");

-- AddForeignKey
ALTER TABLE "EventLocation" ADD CONSTRAINT "EventLocation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPeriod" ADD CONSTRAINT "EventPeriod_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCourse" ADD CONSTRAINT "EventCourse_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventPeriodId_fkey" FOREIGN KEY ("eventPeriodId") REFERENCES "EventPeriod"("eventPeriodId") ON DELETE RESTRICT ON UPDATE CASCADE;
