-- CreateTable
CREATE TABLE "Role" (
    "roleId" SERIAL NOT NULL,
    "roleTitle" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "Privilegy" (
    "privilegyId" SERIAL NOT NULL,
    "privilegyType" TEXT NOT NULL,

    CONSTRAINT "Privilegy_pkey" PRIMARY KEY ("privilegyId")
);

-- CreateTable
CREATE TABLE "RolePrivilegy" (
    "rolePrivilegyId" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "privilegyId" INTEGER NOT NULL,

    CONSTRAINT "RolePrivilegy_pkey" PRIMARY KEY ("rolePrivilegyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_roleTitle_key" ON "Role"("roleTitle");

-- AddForeignKey
ALTER TABLE "RolePrivilegy" ADD CONSTRAINT "RolePrivilegy_privilegyId_fkey" FOREIGN KEY ("privilegyId") REFERENCES "Privilegy"("privilegyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePrivilegy" ADD CONSTRAINT "RolePrivilegy_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;
