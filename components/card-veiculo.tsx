import { Veiculo } from "@prisma/client";
import { TruckIcon } from "lucide-react";
import Image from "next/image";

interface CardVeiculoProps {
  veiculo: Veiculo;
}

const CardVeiculo = ({ veiculo }: CardVeiculoProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {veiculo.imageUrl ? (
        <Image
          alt="Foto do veículo"
          src={veiculo.imageUrl}
          width={50}
          height={50}
          className="h-[50px] w-[50px] rounded-full"
        />
      ) : (
        <TruckIcon size={50} />
      )}
      <div className="flex w-full flex-row">
        <div className="flex w-full flex-col items-start">
          <h3 className="text-bold pe-8 text-xl uppercase whitespace-nowrap max-w-[200px] truncate">
            {veiculo.modelo}
          </h3>
          <h3 className="text-bold pe-4 text-sm uppercase">
            {veiculo.fabricante}
          </h3>
        </div>
        <div className="flex w-full flex-col items-start">
          <div className="flex flex-row">
            <h3 className="pe-1 text-gray-400">Placa:</h3>
            <p>{veiculo.placa}</p>
          </div>
          <div className="flex flex-row">
            <h3 className="pe-1 text-gray-400">Cor:</h3>
            <p>{veiculo.cor}</p>
          </div>
          <div className="flex flex-col">
            <p>{veiculo.numEixos} eixos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardVeiculo;
