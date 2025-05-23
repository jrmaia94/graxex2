"use client";

import { Cliente, Veiculo } from "@prisma/client";
import { TruckIcon } from "lucide-react";
import Image from "next/image";

interface VeiculoFull extends Veiculo {
  cliente: Cliente;
}

interface CardVeiculoProps {
  veiculo: VeiculoFull | undefined;
  obs?: any;
}

const CardSimpleVeiculo = ({ veiculo, obs }: CardVeiculoProps) => {
  console.log(obs);

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
            <h3 className="text-bold pe-4 text-md uppercase truncate max-w-[100%] mb-2">
              {veiculo.fabricante} -{" "}
              <span className="text-sm">{veiculo.modelo}</span>
            </h3>
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
            <div className="text-sm flex flex-row">
              <h3 className="pe-1 text-gray-400">Valor:</h3>
              <p className="text-sm">{obs.price}</p>
            </div>
            {obs?.observacao && (
              <div className="text-sm flex flex-row">
                <h3 className="pe-1 text-gray-400">Obs:</h3>
                <p className="text-sm">{obs.observacao}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return;
  }
};

export default CardSimpleVeiculo;
