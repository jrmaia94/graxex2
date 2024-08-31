/*
  Warnings:

  - The `pricePerVeiculo` column on the `Agendamento` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "pricePerVeiculo",
ADD COLUMN     "pricePerVeiculo" JSONB[];
