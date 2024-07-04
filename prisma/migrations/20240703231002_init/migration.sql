/*
  Warnings:

  - You are about to drop the `Privilegy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePrivilegy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RolePrivilegy" DROP CONSTRAINT "RolePrivilegy_privilegyId_fkey";

-- DropForeignKey
ALTER TABLE "RolePrivilegy" DROP CONSTRAINT "RolePrivilegy_roleId_fkey";

-- DropTable
DROP TABLE "Privilegy";

-- DropTable
DROP TABLE "RolePrivilegy";

-- CreateTable
CREATE TABLE "Privilege" (
    "privilegeId" SERIAL NOT NULL,
    "privilegeType" TEXT NOT NULL,

    CONSTRAINT "Privilege_pkey" PRIMARY KEY ("privilegeId")
);

-- CreateTable
CREATE TABLE "RolePrivilege" (
    "rolePrivilegeId" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "privilegeId" INTEGER NOT NULL,

    CONSTRAINT "RolePrivilege_pkey" PRIMARY KEY ("rolePrivilegeId")
);

-- AddForeignKey
ALTER TABLE "RolePrivilege" ADD CONSTRAINT "RolePrivilege_privilegeId_fkey" FOREIGN KEY ("privilegeId") REFERENCES "Privilege"("privilegeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePrivilege" ADD CONSTRAINT "RolePrivilege_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;
