/*
  Warnings:

  - You are about to drop the column `cicloCliente` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `cicloVeiculo` on the `Veiculo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "cicloCliente",
ADD COLUMN     "ciclo" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Veiculo" DROP COLUMN "cicloVeiculo",
ADD COLUMN     "ciclo" INTEGER NOT NULL DEFAULT 0;
