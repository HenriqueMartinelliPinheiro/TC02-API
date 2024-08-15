/*
  Warnings:

  - You are about to drop the column `title` on the `Event` table. All the data in the column will be lost.
  - Added the required column `eventTitle` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "title",
ADD COLUMN     "eventTitle" VARCHAR(255) NOT NULL;
