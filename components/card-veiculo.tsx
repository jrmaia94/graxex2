import { Veiculo } from "@prisma/client";
import { TruckIcon } from "lucide-react";
import Image from "next/image";

interface CardVeiculoProps {
  veiculo: Veiculo;
}

const CardVeiculo = ({ veiculo }: CardVeiculoProps) => {
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
      <div className="flex flex-row max-w-[450px]">
        <div className="flex w-[200px] flex-col items-start">
          <h3 className="text-bold pe-8 text-xl uppercase whitespace-nowrap max-w-[200px] truncate">
            {veiculo.modelo}
          </h3>
          <h3 className="text-bold pe-4 text-sm uppercase">
            {veiculo.fabricante}
          </h3>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex flex-row">
            <h3 className="text-sm pe-1 text-gray-400">Placa:</h3>
            <p className="text-sm">{veiculo.placa}</p>
          </div>
          <div className="text-sm flex flex-row">
            <h3 className="pe-1 text-gray-400">Cor:</h3>
            <p className="text-sm">{veiculo.cor}</p>
          </div>
          <div className="text-sm flex flex-col">
            <p className="text-sm">{veiculo.numEixos} eixos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardVeiculo;
