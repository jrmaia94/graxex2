"use client";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";

export interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
  agendamentos: Agendamento[];
}

export interface ClienteWVeiculo extends Cliente {
  veiculos: Veiculo[];
}

export interface VeiculoFull extends Veiculo {
  cliente: Cliente;
  agendamentos: {
    veiculoId: number;
    agendamentoId: number;
    agendamento: Agendamento;
  }[];
}

export interface VeiculoWCliente extends Veiculo {
  cliente: Cliente;
}

export interface AgendamentoFull extends Agendamento {
  cliente: ClienteWVeiculo;
  veiculos: {
    veiculoId: number;
    agendamentoId: number;
    veiculo: VeiculoWCliente;
  }[];
}

const Home = () => {
  return <div className="flex justify-center mt-[90px]"></div>;
};

export default Home;
