import { Prisma } from "@prisma/client";

const ListVeiculos = ({
  selectedAgendamentos,
}: {
  selectedAgendamentos: Prisma.AgendamentoGetPayload<{
    include: { veiculos: { include: { veiculo: true } } };
  }>[];
}) => {
  return (
    <div>
      {selectedAgendamentos.map((agendamento) => {
        return agendamento.veiculos.map((item) => (
          <p key={item.veiculo.id}>{item.veiculo.placa}</p>
        ));
      })}
    </div>
  );
};

export default ListVeiculos;
