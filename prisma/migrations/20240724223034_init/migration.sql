/*
  Warnings:

  - The primary key for the `EventCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseName` on the `EventCourse` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `EventCourse` table. All the data in the column will be lost.
  - You are about to drop the column `eventCourseId` on the `EventCourse` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EventCourse` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `EventCourse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventCourse" DROP CONSTRAINT "EventCourse_pkey",
DROP COLUMN "courseName",
DROP COLUMN "createdAt",
DROP COLUMN "eventCourseId",
DROP COLUMN "updatedAt",
ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD CONSTRAINT "EventCourse_pkey" PRIMARY KEY ("eventId", "courseId");

-- CreateTable
CREATE TABLE "Course" (
    "courseId" SERIAL NOT NULL,
    "courseName" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "courseCoordinatorEmail" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseId")
);

-- CreateTable
CREATE TABLE "_EventCourses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventCourses_AB_unique" ON "_EventCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_EventCourses_B_index" ON "_EventCourses"("B");

-- AddForeignKey
ALTER TABLE "EventCourse" ADD CONSTRAINT "EventCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventCourses" ADD CONSTRAINT "_EventCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("courseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventCourses" ADD CONSTRAINT "_EventCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;
