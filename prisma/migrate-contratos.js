//import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const veiculos = require("./motoristas.json");

const prisma = new PrismaClient();

async function main() {
  veiculos.forEach(async (veiculo) => {
    console.log(veiculo.id);

    await prisma.veiculo.update({
      where: {
        id: veiculo.id,
      },
      data: {
        nomeMotorista: veiculo.nomeMotorista,
        phoneMotorista: veiculo.phoneMotorista,
        observacao: "",
      },
    });
  });
}

main()
  .then((e) => {
    console.log(e);
    console.log("Concluído com sucesso");
    prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
