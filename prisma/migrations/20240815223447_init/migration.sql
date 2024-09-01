/*
  Warnings:

  - Changed the type of `eventStatus` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('Nao Iniciado', 'Em Andamento', 'Encerrado', 'Cancelado');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventStatus",
ADD COLUMN     "eventStatus" "EventStatus" NOT NULL;
