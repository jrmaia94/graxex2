const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const veiculosCliente1 = [];
  const veiculosCliente2 = [];
  const veiculosCliente3 = [];
  const veiculosCliente4 = [];
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

  veiculosCliente1.push(veiculo1);

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

  veiculosCliente1.push(veiculo2);

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

  veiculosCliente2.push(veiculo3);

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

  veiculosCliente2.push(veiculo4);

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

  veiculosCliente2.push(veiculo5);

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

  veiculosCliente2.push(veiculo6);

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

  veiculosCliente3.push(veiculo7);

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

  veiculosCliente4.push(veiculo8);

  // Criando Agendamentos para cada Veículo
  // Cliente 1 - 2 Agendamentos por Veículo
  await prisma.agendamento.create({
    data: {
      date: new Date("2024-07-01T08:00:00.000Z"),
      clienteId: cliente1.id,
      veiculos: {
        create: veiculosCliente1.map((veiculo) => {
          return {
            veiculo: {
              connect: {
                id: veiculo.id,
              },
            },
          };
        }),
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-20T16:00:00.000Z"),
      clienteId: cliente1.id,
      veiculos: {
        create: veiculosCliente1.map((veiculo) => {
          return {
            veiculo: {
              connect: {
                id: veiculo.id,
              },
            },
          };
        }),
      },
    },
  });

  // Cliente 2 - 2 Agendamentos por Veículo

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-07-15T08:00:00.000Z"),
      clienteId: cliente2.id,
      veiculos: {
        create: veiculosCliente2.map((veiculo) => {
          return {
            veiculo: {
              connect: {
                id: veiculo.id,
              },
            },
          };
        }),
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-10T14:00:00.000Z"),
      clienteId: cliente2.id,
      veiculos: {
        create: veiculosCliente2.map((veiculo) => {
          return {
            veiculo: {
              connect: {
                id: veiculo.id,
              },
            },
          };
        }),
      },
    },
  });

  // Cliente 3 - 2 Agendamentos para 1 Veículo
  await prisma.agendamento.create({
    data: {
      date: new Date("2024-07-05T08:00:00.000Z"),
      clienteId: cliente3.id,
      veiculos: {
        create: veiculosCliente3.map((veiculo) => {
          return {
            veiculo: {
              connect: {
                id: veiculo.id,
              },
            },
          };
        }),
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-12T16:00:00.000Z"),
      clienteId: cliente3.id,
      veiculos: {
        create: veiculosCliente3.map((veiculo) => {
          return {
            veiculo: {
              connect: {
                id: veiculo.id,
              },
            },
          };
        }),
      },
    },
  });

  // Cliente 4 - 2 Agendamentos para 1 Veículo
  await prisma.agendamento.create({
    data: {
      date: new Date("2024-08-07T09:00:00.000Z"),
      clienteId: cliente4.id,
      veiculos: {
        create: veiculosCliente4.map((veiculo) => {
          return {
            veiculo: {
              connect: {
                id: veiculo.id,
              },
            },
          };
        }),
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-14T13:00:00.000Z"),
      clienteId: cliente4.id,
      veiculos: {
        create: veiculosCliente4.map((veiculo) => {
          return {
            veiculo: {
              connect: {
                id: veiculo.id,
              },
            },
          };
        }),
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
