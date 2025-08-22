import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
  const veiculos = await prisma.veiculo.findMany();

  for (const veiculo of veiculos) {
    if (veiculo.fabricante?.toUpperCase().includes("VOLKS"))
      await prisma.veiculo.update({
        where: {
          id: veiculo.id,
        },
        data: {
          fabricante: "VOLKSWAGEN",
        },
      });
  }
}

main();
