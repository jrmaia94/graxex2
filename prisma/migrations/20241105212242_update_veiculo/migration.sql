/*
  Warnings:

  - You are about to drop the column `frequenciaDeServicos` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `frequenciaDeServicos` on the `Veiculo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "frequenciaDeServicos",
ADD COLUMN     "cicloCliente" INTEGER;

-- AlterTable
ALTER TABLE "Veiculo" DROP COLUMN "frequenciaDeServicos",
ADD COLUMN     "cicloVeiculo" INTEGER;
