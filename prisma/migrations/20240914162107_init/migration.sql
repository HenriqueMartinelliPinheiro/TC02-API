/*
  Warnings:

  - You are about to drop the column `studentEntryYear` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "studentEntryYear";

-- AlterTable
ALTER TABLE "EventCourse" ALTER COLUMN "courseName" SET DEFAULT 'Curso  ';
