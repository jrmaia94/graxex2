-- AlterTable
ALTER TABLE "Veiculo" ADD COLUMN     "grupoId" INTEGER;

-- CreateTable
CREATE TABLE "GrupoCliente" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GrupoCliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GrupoCliente_name_key" ON "GrupoCliente"("name");

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "GrupoCliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
