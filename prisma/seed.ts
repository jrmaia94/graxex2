const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Criando Clientes
  const cliente1 = await prisma.cliente.create({
    data: {
      name: "João Caminhoneiro",
      address: "Rua dos Caminhões, 100",
      phone: "11987654321",
      imageUrl: "https://example.com/images/joao.jpg",
    },
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      name: "Empresa Logística LTDA",
      address: "Avenida Transporte, 200",
      phone: "1134567890",
      imageUrl: "https://example.com/images/empresa.jpg",
    },
  });

  const cliente3 = await prisma.cliente.create({
    data: {
      name: "Carlos Transportes",
      address: "Rua dos Semirreboques, 300",
      phone: "11912345678",
      imageUrl: "https://example.com/images/carlos.jpg",
    },
  });

  const cliente4 = await prisma.cliente.create({
    data: {
      name: "Marta Carretas",
      address: "Avenida das Rodas, 400",
      phone: "1123456789",
      imageUrl: "https://example.com/images/marta.jpg",
    },
  });

  // Criando Veículos para os Clientes
  // Cliente 1 - 2 veículos
  const veiculo1 = await prisma.veiculo.create({
    data: {
      modelo: "Caminhão Modelo X",
      fabricante: "Scania",
      imageUrl: "https://example.com/images/caminhao1.jpg",
      placa: "ABC-1234",
      cor: "Azul",
      numEixos: 3,
      clienteId: cliente1.id,
    },
  });

  const veiculo2 = await prisma.veiculo.create({
    data: {
      modelo: "Semirreboque Modelo A",
      fabricante: "Randon",
      imageUrl: "https://example.com/images/semirreboque1.jpg",
      placa: "XYZ-5678",
      cor: "Preto",
      numEixos: 2,
      clienteId: cliente1.id,
    },
  });

  // Cliente 2 - 4 veículos
  const veiculo3 = await prisma.veiculo.create({
    data: {
      modelo: "Caminhão Modelo Y",
      fabricante: "Mercedes-Benz",
      imageUrl: "https://example.com/images/caminhao2.jpg",
      placa: "DEF-1234",
      cor: "Vermelho",
      numEixos: 3,
      clienteId: cliente2.id,
    },
  });

  const veiculo4 = await prisma.veiculo.create({
    data: {
      modelo: "Semirreboque Modelo B",
      fabricante: "Librelato",
      imageUrl: "https://example.com/images/semirreboque2.jpg",
      placa: "QWE-5678",
      cor: "Branco",
      numEixos: 2,
      clienteId: cliente2.id,
    },
  });

  const veiculo5 = await prisma.veiculo.create({
    data: {
      modelo: "Caminhão Modelo Z",
      fabricante: "Volvo",
      imageUrl: "https://example.com/images/caminhao3.jpg",
      placa: "GHI-1234",
      cor: "Amarelo",
      numEixos: 3,
      clienteId: cliente2.id,
    },
  });

  const veiculo6 = await prisma.veiculo.create({
    data: {
      modelo: "Semirreboque Duplo Modelo C",
      fabricante: "Facchini",
      imageUrl: "https://example.com/images/semirreboque3.jpg",
      placa: "RTY-5678",
      cor: "Verde",
      numEixos: 3,
      clienteId: cliente2.id,
    },
  });

  // Cliente 3 - 1 veículo
  const veiculo7 = await prisma.veiculo.create({
    data: {
      modelo: "Semirreboque Duplo Modelo D",
      fabricante: "Noma",
      imageUrl: "https://example.com/images/semirreboque4.jpg",
      placa: "UJK-1234",
      cor: "Cinza",
      numEixos: 3,
      clienteId: cliente3.id,
    },
  });

  // Cliente 4 - 1 veículo
  const veiculo8 = await prisma.veiculo.create({
    data: {
      modelo: "Caminhão Modelo W",
      fabricante: "Iveco",
      imageUrl: "https://example.com/images/caminhao4.jpg",
      placa: "LOP-5678",
      cor: "Roxo",
      numEixos: 3,
      clienteId: cliente4.id,
    },
  });

  // Criando Agendamentos para cada Veículo
  // Cliente 1 - 2 Agendamentos por Veículo
  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-01T08:00:00.000Z"),
      clienteId: cliente1.id,
      veiculos: {
        create: [{ veiculoId: veiculo1.id }],
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-15T14:00:00.000Z"),
      clienteId: cliente1.id,
      veiculos: {
        create: [{ veiculoId: veiculo1.id }],
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-05T10:00:00.000Z"),
      clienteId: cliente1.id,
      veiculos: {
        create: [{ veiculoId: veiculo2.id }],
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-20T16:00:00.000Z"),
      clienteId: cliente1.id,
      veiculos: {
        create: [{ veiculoId: veiculo2.id }],
      },
    },
  });

  // Cliente 2 - 2 Agendamentos por Veículo
  const veiculosCliente2 = [veiculo3, veiculo4, veiculo5, veiculo6];

  for (const veiculo of veiculosCliente2) {
    await prisma.agendamento.create({
      data: {
        date: new Date("2024-09-01T08:00:00.000Z"),
        clienteId: cliente2.id,
        veiculos: {
          create: [{ veiculoId: veiculo.id }],
        },
      },
    });

    await prisma.agendamento.create({
      data: {
        date: new Date("2024-09-10T14:00:00.000Z"),
        clienteId: cliente2.id,
        veiculos: {
          create: [{ veiculoId: veiculo.id }],
        },
      },
    });
  }

  // Cliente 3 - 2 Agendamentos para 1 Veículo
  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-05T08:00:00.000Z"),
      clienteId: cliente3.id,
      veiculos: {
        create: [{ veiculoId: veiculo7.id }],
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-12T16:00:00.000Z"),
      clienteId: cliente3.id,
      veiculos: {
        create: [{ veiculoId: veiculo7.id }],
      },
    },
  });

  // Cliente 4 - 2 Agendamentos para 1 Veículo
  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-07T09:00:00.000Z"),
      clienteId: cliente4.id,
      veiculos: {
        create: [{ veiculoId: veiculo8.id }],
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-14T13:00:00.000Z"),
      clienteId: cliente4.id,
      veiculos: {
        create: [{ veiculoId: veiculo8.id }],
      },
    },
  });

  console.log("Banco de dados populado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
