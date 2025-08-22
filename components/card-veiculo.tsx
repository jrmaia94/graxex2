"use client";

import { getClienteById } from "@/app/actions/get-clientes";
import { Cliente, Veiculo } from "@prisma/client";
import { PhoneCallIcon, TruckIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface VeiculoFull extends Veiculo {
  cliente: Cliente;
}

interface CardVeiculoProps {
  veiculo: VeiculoFull | undefined;
}

const CardVeiculo = ({ veiculo }: CardVeiculoProps) => {
  const { data }: { data: any } = useSession({
    required: true,
  });
  const switchFabricante = (fabricante: string) => {
    switch (fabricante) {
      case "MERCEDES BENZ":
        return "MB";
      case "VOLKSWAGEN":
        return "VW";
      default:
        return fabricante;
    }
  };
  if (veiculo) {
    return (
      <div className="flex justify-between items-center max-w-[500px] gap-2">
        {veiculo.imageUrl ? (
          <Image
            alt="Foto do veículo"
            src={veiculo.imageUrl}
            width={50}
            height={50}
            className="h-[50px] max-w-[50px] rounded-full"
          />
        ) : (
          <TruckIcon size={50} />
        )}
        <div className="flex flex-row w-full h-full">
          <div className="flex w-full flex-col p-1 items-start justify-center">
            <Link href={`/veiculos/${veiculo.id}`} className="max-w-[90%]">
              <h3 className="text-bold pe-4 text-md uppercase truncate max-w-[100%]">
                {veiculo.frota && veiculo.frota + " - "}
                {switchFabricante(veiculo.fabricante || "")} -{" "}
                <span className="text-sm">{veiculo.modelo}</span>
              </h3>
            </Link>
            <div className="flex gap-3 items-center">
              <p className="text-sm">{veiculo.cliente.name}</p>
              {veiculo.phoneMotorista && (
                <>
                  <span>-</span>
                  <div className="flex items-center gap-1">
                    <span>
                      <Link
                        href={`https://wa.me//${veiculo.phoneMotorista
                          ?.toString()
                          .replace(
                            /\D/g,
                            ""
                          )}?text=Bom%20dia!%20Vamos%20engraxar%20hoje?`}
                        target="_blank"
                      >
                        <Image
                          className="rounded-full"
                          alt="Ícone Whatsapp"
                          src="/wpp-icon.svg"
                          width={15}
                          height={15}
                        />
                      </Link>
                    </span>
                    {veiculo.nomeMotorista && (
                      <p className="text-sm">{veiculo.nomeMotorista}</p>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <div className="flex flex-row">
                <h3 className="text-sm pe-1 text-gray-400">Placa:</h3>
                <p className="text-sm">{veiculo.placa}</p>
              </div>
              <div className="text-sm flex flex-row">
                <h3 className="pe-1 text-gray-400">Cor:</h3>
                <p className="text-sm">{veiculo.cor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return;
  }
};

export default CardVeiculo;
