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
      <div className="flex flex-row w-full">
        <div className="flex w-full flex-col items-start">
          <h3 className="text-bold pe-4 text-md uppercase">
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
        </div>
      </div>
    </div>
  );
};

export default CardVeiculo;
