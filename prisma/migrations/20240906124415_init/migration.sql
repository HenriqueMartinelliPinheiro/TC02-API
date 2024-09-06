/*
  Warnings:

  - The primary key for the `EventCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventCourse" DROP CONSTRAINT "EventCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "_EventCourses" DROP CONSTRAINT "_EventCourses_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventCourses" DROP CONSTRAINT "_EventCourses_B_fkey";

-- AlterTable
ALTER TABLE "EventCourse" DROP CONSTRAINT "EventCourse_pkey",
ADD COLUMN     "courseName" TEXT NOT NULL DEFAULT 'Curso',
ADD COLUMN     "eventCourseId" SERIAL NOT NULL,
ADD CONSTRAINT "EventCourse_pkey" PRIMARY KEY ("eventCourseId");

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "_EventCourses";
