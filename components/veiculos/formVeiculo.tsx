"use client";
import { Button } from "@/components/ui/button";
import InputMask from "react-input-mask";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { createVeiculo } from "@/app/actions/post-veiculo";
import { Cliente, User, Veiculo } from "@prisma/client";
import Loader from "@/components/loader";
import Link from "next/link";
import SendImage from "@/components/send-image";
import { getAllClientes, getClienteById } from "@/app/actions/get-clientes";
import { VeiculoFull } from "@/app/page";
import { getAllVeiculos } from "@/app/actions/get-veiculos";

interface VeiculoPageProps {
  user: User;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface VeiculoFoto {
  modelo: string;
  fabricante: string;
  cor: string;
  empresa: string;
  placa: string;
  numero_da_frota: string;
}

export const FormVeiculo = ({ user, setIsOpen }: VeiculoPageProps) => {
  const params: { id: string } = useParams();

  // Garantir que tenha usuário logado
  const [isPending, startTransition] = useTransition();
  const [veiculo, setVeiculo] = useState<VeiculoFull>();
  const [veiculos, setVeiculos] = useState<VeiculoFull[]>([]);
  const [fabricantes, setFabricantes] = useState<string[]>([]);
  const [modelos, setModelos] = useState<string[]>([]);
  const [veiculoFoto, setVeiculoFoto] = useState<VeiculoFoto | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<number>(-1);

  // Controle do formulário
  const inputIDRef = useRef<any>(null);
  const inputModeloRef = useRef<any>(null);
  const inputFabricanteRef = useRef<any>(null);
  const inputPlacaRef = useRef<any>(null);
  const inputCorRef = useRef<any>(null);
  const selectEixosRef = useRef<any>(null);
  const inputFrotaRef = useRef<any>(null);
  const inputObsRef = useRef<any>(null);
  const inputNomeMotoRef = useRef<any>(null);
  const inputPhoneMotoRef = useRef<any>(null);
  const inputFreqServicosRef = useRef<any>(null);

  // Lida com o envio do formulário
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Limpa espaços e transforma "" em null
    const clearFields = (field: string) => {
      if (field === "") {
        return null;
      } else {
        return field.trim().replace(/\s+/g, " ");
      }
    };

    // Efetuando cadastro
    startTransition(() => {
      const cadVeiculo: Pick<
        Veiculo,
        | "clienteId"
        | "cor"
        | "fabricante"
        | "frota"
        | "modelo"
        | "nomeMotorista"
        | "numEixos"
        | "observacao"
        | "phoneMotorista"
        | "placa"
        | "ciclo"
      > = {
        clienteId: selectedCliente,
        modelo: clearFields(inputModeloRef.current?.value) || "",
        fabricante: clearFields(inputFabricanteRef.current?.value),
        placa: clearFields(inputPlacaRef.current?.value)?.toUpperCase() || "",
        cor: clearFields(inputCorRef.current.value),
        frota: clearFields(inputFrotaRef.current.value),
        observacao: clearFields(inputObsRef.current.value),
        nomeMotorista: inputNomeMotoRef.current.value,
        phoneMotorista: inputPhoneMotoRef.current.value,
        numEixos: parseInt(selectEixosRef.current?.value),
        ciclo: parseInt(inputFreqServicosRef.current?.value) || 0,
      };

      user &&
        createVeiculo(cadVeiculo, user)
          .then((res) => {
            toast.success("Veículo cadastrado com sucesso!");
            setIsOpen(false);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Erro ao cadastrar cliente!");
          });
    });
  };

  // Lida com o carregamento da página com parâmetros
  useEffect(() => {
    startTransition(() => {
      if (user) {
        getAllClientes(user)
          .then((res) => {
            setClientes(res);
          })
          .catch((err) => {
            console.log(err);
          });

        getAllVeiculos(user)
          .then((res) => {
            setVeiculos(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }, [user]);

  // Atualiza inputs com os dados do cliente encontrado
  useEffect(() => {
    getClienteById(parseInt(params.id), user)
      .then((res) => {
        if (res) {
          setSelectedCliente(res.id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params, user]);

  // Lida com a mascara do input CPF/CNPJ

  useEffect(() => {
    veiculoFoto &&
      startTransition(() => {
        inputModeloRef.current.value = veiculoFoto?.modelo;
        inputFabricanteRef.current.value = veiculoFoto?.fabricante;
        inputPlacaRef.current.value = veiculoFoto?.placa;
        inputCorRef.current.value = veiculoFoto?.cor;
        inputFrotaRef.current.value = veiculoFoto?.numero_da_frota;
      });
  }, [veiculoFoto]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[600px]">
        {isPending && <Loader />}
        <form
          onSubmit={handleSubmit}
          className="gap-3 flex flex-col bg-ring rounded-xl py-4 px-2"
        >
          <SendImage setVeiculoFoto={setVeiculoFoto} />
          <div className="flex flex-col">
            <label className="text-primary-foreground">id</label>
            <input
              readOnly
              disabled
              ref={inputIDRef}
              type="text"
              className="h-8 bg-primary text-primary-foreground p-1 rounded-sm w-[100px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary-foreground">Cliente</label>
            <input
              type="text"
              value={clientes.find((c) => c.id === selectedCliente)?.name ?? ""}
              className="h-8 bg-primary text-primary-foreground p-1 rounded-sm"
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <label className="text-primary-foreground">Fabricante</label>
            <input
              ref={inputFabricanteRef}
              type="text"
              className="h-8 bg-primary text-primary-foreground p-1 rounded-sm"
              list="list-fabricante"
            />
            <datalist id="list-fabricante">
              {fabricantes.map((item, index) => {
                return <option value={item} key={index}></option>;
              })}
            </datalist>
          </div>
          <div className="flex flex-col">
            <label className="text-primary-foreground">Modelo</label>
            <input
              list="list-modelos"
              required
              ref={inputModeloRef}
              type="text"
              className="h-8 bg-primary text-primary-foreground p-1 rounded-sm"
            />
            <datalist id="list-modelos">
              {modelos.map((item, index) => {
                return <option value={item} key={index}></option>;
              })}
            </datalist>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex flex-col">
              <label className="text-primary-foreground">Placa</label>
              <InputMask
                ref={inputPlacaRef}
                mask="aaa-9*99"
                className="h-8 text-primary-foreground bg-primary p-1 rounded-sm w-full max-w-[150px]"
                onBlur={(e) =>
                  (e.target.value = e.target.value.toString().toUpperCase())
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="text-primary-foreground">Cor</label>
              <input
                ref={inputCorRef}
                type="text"
                className="h-8 bg-primary text-primary-foreground p-1 rounded-sm w-[60px]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-primary-foreground">Frota</label>
              <input
                ref={inputFrotaRef}
                type="text"
                className="h-8 bg-primary text-primary-foreground p-1 rounded-sm w-[70px]"
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex flex-col">
              <label className="text-primary-foreground">Obs</label>
              <input
                ref={inputObsRef}
                type="text"
                className="h-8 bg-primary text-primary-foreground p-1 rounded-sm w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-primary-foreground">Eixos</label>
              <select
                className="text-primary-foreground h-8 p-1 rounded-sm w-[100px]"
                name="eixos"
                id="eixos"
                ref={selectEixosRef}
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex flex-col">
              <label className="text-primary-foreground">
                Nome do motorista
              </label>
              <input
                ref={inputNomeMotoRef}
                type="text"
                className="h-8 bg-primary text-primary-foreground p-1 rounded-sm max-w-[250px] w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-primary-foreground">
                Telefone do motorista
              </label>
              <InputMask
                ref={inputPhoneMotoRef}
                mask="+55(99)99999-9999"
                className="h-8 text-primary-foreground bg-primary p-1 rounded-sm max-w-[200px] w-full"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-primary-foreground">Ciclo(dias)</label>
            <input
              ref={inputFreqServicosRef}
              type="number"
              className="h-8 bg-primary text-primary-foreground p-1 rounded-sm max-w-[80px] w-full"
            />
          </div>
          <div className="flex gap-10 items-center">
            <Button
              disabled={isPending}
              className="w-[100px] bg-primary"
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
