/*
  Warnings:

  - The primary key for the `Agendamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Agendamento` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AgendamentosPorVeiculos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Cliente` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Veiculo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Veiculo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `clienteId` on the `Agendamento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `veiculoId` on the `AgendamentosPorVeiculos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `agendamentoId` on the `AgendamentosPorVeiculos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `clienteId` on the `Veiculo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "AgendamentosPorVeiculos" DROP CONSTRAINT "AgendamentosPorVeiculos_agendamentoId_fkey";

-- DropForeignKey
ALTER TABLE "AgendamentosPorVeiculos" DROP CONSTRAINT "AgendamentosPorVeiculos_veiculoId_fkey";

-- DropForeignKey
ALTER TABLE "Veiculo" DROP CONSTRAINT "Veiculo_clienteId_fkey";

-- AlterTable
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clienteId",
ADD COLUMN     "clienteId" INTEGER NOT NULL,
ADD CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AgendamentosPorVeiculos" DROP CONSTRAINT "AgendamentosPorVeiculos_pkey",
DROP COLUMN "veiculoId",
ADD COLUMN     "veiculoId" INTEGER NOT NULL,
DROP COLUMN "agendamentoId",
ADD COLUMN     "agendamentoId" INTEGER NOT NULL,
ADD CONSTRAINT "AgendamentosPorVeiculos_pkey" PRIMARY KEY ("veiculoId", "agendamentoId");

-- AlterTable
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Veiculo" DROP CONSTRAINT "Veiculo_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "clienteId",
ADD COLUMN     "clienteId" INTEGER NOT NULL,
ADD CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentosPorVeiculos" ADD CONSTRAINT "AgendamentosPorVeiculos_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentosPorVeiculos" ADD CONSTRAINT "AgendamentosPorVeiculos_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
