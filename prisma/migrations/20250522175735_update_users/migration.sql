-- CreateEnum
CREATE TYPE "TypeUser" AS ENUM ('CLIENTE', 'COLABORADOR', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "typeUser" "TypeUser" NOT NULL DEFAULT 'COLABORADOR';
