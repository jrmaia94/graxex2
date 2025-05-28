import { AgendamentoFull } from "@/app/page";
import { Cliente } from "@prisma/client";

export interface GroupedAgendamentos {
  cliente: Cliente;
  agendamentos: AgendamentoFull[];
}

export const groupAgendamentosByClient = (agendamentos: AgendamentoFull[]) => {
  const clientes: number[] = [
    ...new Set(agendamentos.map((agendamento) => agendamento.clienteId)),
  ];
  const groupedAgendamentos: GroupedAgendamentos[] = clientes.map((id) => {
    const agendamentosDoCliente = agendamentos.filter(
      (agendamento) => agendamento.clienteId === id
    );
    return {
      cliente: agendamentosDoCliente[0].cliente,
      agendamentos: agendamentosDoCliente,
    };
  });

  return groupedAgendamentos;
};
