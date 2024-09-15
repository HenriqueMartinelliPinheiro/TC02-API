/*
  Warnings:

  - Added the required column `studentCpf` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "studentCpf" TEXT NOT NULL;
