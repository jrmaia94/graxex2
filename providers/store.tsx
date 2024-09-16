"use client";

import { getAllAgendamentos } from "@/app/actions/get-agendamentos";
import { getAllClientes } from "@/app/actions/get-clientes";
import { getAllVeiculos } from "@/app/actions/get-veiculos";
import Loader from "@/components/loader";
import { Agendamento, Cliente, Veiculo } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";

export interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
  agendamentos: Agendamento[];
}

export interface VeiculoFull extends Veiculo {
  cliente: Cliente;
  agendamentos: {
    veiculoId: number;
    agendamentoId: number;
    agendamento: AgendamentoFull;
  }[];
}

export interface AgendamentoFull extends Agendamento {
  cliente: ClienteFull;
  veiculos: {
    veiculoId: number;
    adengamentoId: number;
    veiculo: VeiculoFull;
  }[];
}

export interface DataProps {
  clientes: ClienteFull[];
  veiculos: VeiculoFull[];
  agendamentos: AgendamentoFull[];
}

export interface DataProviderProps {
  data: DataProps | null;
  setData: Dispatch<SetStateAction<DataProps>>;
}
export const DataContext = createContext<DataProviderProps>({
  data: null,
  setData: () => {},
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session }: { data: any } = useSession({ required: true });
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<DataProps>({
    clientes: [],
    veiculos: [],
    agendamentos: [],
  });

  useEffect(() => {
    startTransition(() => {
      if (session) {
        if (session.user) {
          getAllClientes(session.user)
            .then((res: any) => {
              setData((prevData) => {
                const newData = { ...prevData };
                newData.clientes = res;
                return newData;
              });
            })
            .catch((err) => {
              console.log(err);
            });

          getAllVeiculos(session.user)
            .then((res: any) => {
              setData((prevData) => {
                const newData = { ...prevData };
                newData.veiculos = res;
                return newData;
              });
            })
            .catch((err) => {
              console.log(err);
            });

          getAllAgendamentos(session.user)
            .then((res: any) => {
              setData((prevData) => {
                const newData = { ...prevData };
                newData.agendamentos = res;
                return newData;
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  }, [session]);

  return (
    <DataContext.Provider value={{ data: data, setData: setData }}>
      {isPending && <Loader />}
      {!isPending && children}
    </DataContext.Provider>
  );
};
