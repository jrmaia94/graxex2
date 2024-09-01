const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // 1º Cliente com 1 veículo
  const veiculo1 = await prisma.veiculo.create({
    data: {
      modelo: "Caminhão Modelo 1",
      fabricante: "Fabricante 1",
      placa: "ABC-1234",
      cor: "Azul",
      numEixos: 2,
      cliente: {
        create: {
          name: "Cliente 1",
        },
      },
    },
  });

  await prisma.agendamento.createMany({
    data: [
      {
        date: new Date("2024-08-01"),
        serviceCompleted: new Date("2024-08-10"),
        clienteId: veiculo1.clienteId,
      },
      {
        date: new Date("2024-09-01"),
        clienteId: veiculo1.clienteId,
      },
    ],
  });

  const veiculo2 = await prisma.veiculo.createMany({
    data: [
      {
        modelo: "Caminhão Modelo 2",
        fabricante: "Fabricante 2",
        placa: "DEF-5678",
        cor: "Vermelho",
        numEixos: 3,
        clienteId: veiculo1.clienteId,
      },
      {
        modelo: "Caminhão Modelo 3",
        fabricante: "Fabricante 3",
        placa: "GHI-9012",
        cor: "Verde",
        numEixos: 2,
        clienteId: veiculo1.clienteId,
      },
    ],
  });

  await prisma.agendamento.createMany({
    data: [
      {
        date: new Date("2024-07-01"),
        serviceCompleted: new Date("2024-07-10"),
        clienteId: veiculo2.clienteId,
      },
      {
        date: new Date("2024-10-01"),
        clienteId: veiculo2.clienteId,
      },
    ],
  });

  const veiculo3 = await prisma.veiculo.createMany({
    data: [
      {
        modelo: "Caminhão Modelo 4",
        fabricante: "Fabricante 4",
        placa: "JKL-3456",
        cor: "Preto",
        numEixos: 4,
        clienteId: veiculo1.clienteId,
      },
      {
        modelo: "Caminhão Modelo 5",
        fabricante: "Fabricante 5",
        placa: "MNO-7890",
        cor: "Branco",
        numEixos: 2,
        clienteId: veiculo1.clienteId,
      },
      {
        modelo: "Caminhão Modelo 6",
        fabricante: "Fabricante 6",
        placa: "PQR-1234",
        cor: "Cinza",
        numEixos: 3,
        clienteId: veiculo1.clienteId,
      },
    ],
  });

  await prisma.agendamento.createMany({
    data: [
      {
        date: new Date("2024-06-01"),
        serviceCompleted: new Date("2024-06-10"),
        clienteId: veiculo3.clienteId,
      },
      {
        date: new Date("2024-11-01"),
        clienteId: veiculo3.clienteId,
      },
    ],
  });

  const veiculo4 = await prisma.veiculo.createMany({
    data: [
      {
        modelo: "Caminhão Modelo 7",
        fabricante: "Fabricante 7",
        placa: "STU-5678",
        cor: "Amarelo",
        numEixos: 2,
        clienteId: veiculo1.clienteId,
      },
      {
        modelo: "Caminhão Modelo 8",
        fabricante: "Fabricante 8",
        placa: "VWX-9012",
        cor: "Roxo",
        numEixos: 3,
        clienteId: veiculo1.clienteId,
      },
      {
        modelo: "Caminhão Modelo 9",
        fabricante: "Fabricante 9",
        placa: "YZA-3456",
        cor: "Azul",
        numEixos: 4,
        clienteId: veiculo1.clienteId,
      },
      {
        modelo: "Caminhão Modelo 10",
        fabricante: "Fabricante 10",
        placa: "BCD-7890",
        cor: "Verde",
        numEixos: 2,
        clienteId: veiculo1.clienteId,
      },
    ],
  });

  await prisma.agendamento.createMany({
    data: [
      {
        date: new Date("2024-05-01"),
        serviceCompleted: new Date("2024-05-10"),
        clienteId: veiculo4.clienteId,
      },
      {
        date: new Date("2024-12-01"),
        clienteId: veiculo4.clienteId,
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
