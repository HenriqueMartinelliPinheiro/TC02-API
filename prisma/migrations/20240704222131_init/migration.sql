/*
  Warnings:

  - You are about to drop the `Privilege` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePrivilege` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RolePrivilege" DROP CONSTRAINT "RolePrivilege_privilegeId_fkey";

-- DropForeignKey
ALTER TABLE "RolePrivilege" DROP CONSTRAINT "RolePrivilege_roleId_fkey";

-- DropTable
DROP TABLE "Privilege";

-- DropTable
DROP TABLE "RolePrivilege";
