/*
  Warnings:

  - Added the required column `studentEntryYear` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "studentEntryYear" INTEGER NOT NULL;
