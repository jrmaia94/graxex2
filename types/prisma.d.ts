import { Prisma } from "@prisma/client";

declare module "@prisma/client" {
  export interface AgendamentoAlterado
    extends Prisma.AgendamentoGetPayload<{
      include: { veiculos: { include: { veiculo: true } } };
    }> {
    pricePerVeiculo: {
      price: number;
      veiculoId: number;
      observacao: string;
    }[];
  }
}
