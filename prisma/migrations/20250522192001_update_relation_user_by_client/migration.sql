-- CreateTable
CREATE TABLE "UsuariosPorCliente" (
    "userId" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "UsuariosPorCliente_pkey" PRIMARY KEY ("userId","clienteId")
);

-- AddForeignKey
ALTER TABLE "UsuariosPorCliente" ADD CONSTRAINT "UsuariosPorCliente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosPorCliente" ADD CONSTRAINT "UsuariosPorCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
