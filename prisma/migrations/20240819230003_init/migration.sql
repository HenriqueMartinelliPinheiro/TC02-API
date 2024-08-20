/*
  Warnings:

  - Added the required column `eventActivityTitle` to the `EventActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventActivity" ADD COLUMN     "eventActivityTitle" TEXT NOT NULL;
