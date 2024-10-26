-- CreateTable
CREATE TABLE "StudentLogin" (
    "studentLoginId" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessToken" TEXT,
    "accessTokenExpiration" TIMESTAMP(3),
    "studentRegistration" TEXT NOT NULL,
    "studentCpf" TEXT NOT NULL,

    CONSTRAINT "StudentLogin_pkey" PRIMARY KEY ("studentLoginId")
);
