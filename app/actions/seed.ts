"use server";
import { PrismaClient, Veiculo } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
  // 1º Cliente com 1 veículo
  const c1 = await prisma.cliente.create({
    data: {
      name: "Fernando",
    },
  });

  const c1v1 = await prisma.veiculo.create({
    data: {
      modelo: "FH 16",
      fabricante: "Volvo",
      numEixos: 9,
      placa: "ABC-1111",
      clienteId: c1.id,
      cor: "Preto",
    },
  });

  const ac1 = await prisma.agendamento.create({
    data: {
      date: new Date("2024-08-01"),
      serviceCompleted: new Date("2024-08-10"),
      clienteId: c1.id,
      veiculos: { create: [{ veiculoId: c1v1.id }] },
    },
  });
  const a2c1 = await prisma.agendamento.create({
    data: {
      date: new Date("2024-09-10"),
      clienteId: c1.id,
      veiculos: { create: [{ veiculoId: c1v1.id }] },
    },
  });

  // 2º Cliente com 2 veículos
  const cliente2 = await prisma.cliente.create({
    data: {
      name: "Costa e Silva Transportes",
    },
  });

  const veiculosCliente2: Veiculo[] = [];

  const cliente2Veiculo1 = await prisma.veiculo.create({
    data: {
      clienteId: cliente2.id,
      modelo: "FM",
      fabricante: "Volvo",
      placa: "DEF-5678",
      cor: "Vermelho",
      numEixos: 3,
    },
  });
  veiculosCliente2.push(cliente2Veiculo1);
  const cliente2Veiculo2 = await prisma.veiculo.create({
    data: {
      clienteId: cliente2.id,
      modelo: "FH 540",
      fabricante: "Volvo",
      placa: "GHI-9012",
      cor: "Verde",
      numEixos: 2,
    },
  });
  veiculosCliente2.push(cliente2Veiculo2);
  const agendamento1Cliente2 = await prisma.agendamento.create({
    data: {
      clienteId: cliente2.id,
      date: new Date("2024-07-01"),
      serviceCompleted: new Date("2024-07-10"),
      veiculos: {
        create: veiculosCliente2.map((veiculo) => ({ veiculoId: veiculo.id })),
      },
    },
  });

  const agendamento2Cliente2 = await prisma.agendamento.create({
    data: {
      clienteId: cliente2.id,
      date: new Date("2024-10-01"),
      veiculos: {
        create: veiculosCliente2.map((veiculo) => ({
          veiculoId: veiculo.id,
        })),
      },
    },
  });

  // 3º Cliente com 3 veículos
  const cliente3 = await prisma.cliente.create({
    data: {
      name: "Empresa Logística",
    },
  });

  const veiculosCliente3: Veiculo[] = [];

  const cliente3veiculo1 = await prisma.veiculo.create({
    data: {
      clienteId: cliente3.id,
      modelo: "Actros",
      fabricante: "Mercedes-Benz",
      placa: "JKL-3456",
      cor: "Preto",
      numEixos: 4,
    },
  });
  veiculosCliente3.push(cliente3veiculo1);

  const cliente3veiculo2 = await prisma.veiculo.create({
    data: {
      clienteId: cliente3.id,
      modelo: "Actros",
      fabricante: "Mercedes-Benz",
      placa: "MNO-7890",
      cor: "Branco",
      numEixos: 2,
    },
  });

  veiculosCliente3.push(cliente3veiculo2);

  const cliente3Veiculo3 = await prisma.veiculo.create({
    data: {
      clienteId: cliente3.id,
      modelo: "R580",
      fabricante: "Scania",
      placa: "PQR-1234",
      cor: "Cinza",
      numEixos: 3,
    },
  });
  await prisma.agendamento.create({
    data: {
      clienteId: cliente3.id,
      date: new Date("2024-06-01"),
      serviceCompleted: new Date("2024-06-10"),
      veiculos: {
        create: veiculosCliente3.map((veiculo) => ({ veiculoId: veiculo.id })),
      },
    },
  });

  await prisma.agendamento.create({
    data: {
      clienteId: cliente3.id,
      date: new Date("2024-11-01"),
      veiculos: {
        create: veiculosCliente3.map((veiculo) => ({
          veiculoId: veiculo.id,
        })),
      },
    },
  });

  // 4º Cliente com 4 veículos
  const cliente4 = await prisma.cliente.create({
    data: {
      name: "WWP Transportes",
    },
  });
  const cliente4Veiculos: Veiculo[] = [];

  const cliente4veiculo1 = await prisma.veiculo.create({
    data: {
      clienteId: cliente4.id,
      modelo: "TGX",
      fabricante: "MAN",
      placa: "STU-5678",
      cor: "Amarelo",
      numEixos: 2,
    },
  });

  const cliente4veiculo2 = await prisma.veiculo.create({
    data: {
      clienteId: cliente4.id,
      modelo: "TGX",
      fabricante: "MAN",
      placa: "VWX-9012",
      cor: "Roxo",
      numEixos: 3,
    },
  });

  const cliente4veiculo3 = await prisma.veiculo.create({
    data: {
      clienteId: cliente4.id,
      modelo: "XF",
      fabricante: "DAF",
      placa: "YZA-3456",
      cor: "Azul",
      numEixos: 4,
    },
  });

  const cliente4veiculo4 = await prisma.veiculo.create({
    data: {
      clienteId: cliente4.id,
      modelo: "XF",
      fabricante: "DAF",
      placa: "BCD-7890",
      cor: "Verde",
      numEixos: 2,
    },
  });

  cliente4Veiculos.push(cliente4veiculo1);
  cliente4Veiculos.push(cliente4veiculo2);
  cliente4Veiculos.push(cliente4veiculo3);
  cliente4Veiculos.push(cliente4veiculo4);

  await prisma.agendamento.create({
    data: {
      date: new Date("2024-05-01"),
      serviceCompleted: new Date("2024-05-10"),
      clienteId: cliente4.id,
      veiculos: {
        create: cliente4Veiculos.map((veiculo) => ({
          veiculoId: veiculo.id,
        })),
      },
    },
  });
  await prisma.agendamento.create({
    data: {
      date: new Date("2024-12-01"),
      clienteId: cliente4.id,
      veiculos: {
        create: cliente4Veiculos.map((veiculo) => ({
          veiculoId: veiculo.id,
        })),
      },
    },
  });
}
