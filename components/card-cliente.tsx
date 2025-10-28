import { Cliente, Veiculo } from "@prisma/client";
import { TruckIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
}

const CardCliente = ({ cliente }: { cliente: ClienteFull }) => {
  return (
    <div className="flex flex-row items-center gap-2 py-4 px-2">
      <div className="flex justify-between w-full">
        <div className="flex flex-col items-start overflow-hidden gap-1">
          <div className="flex gap-7">
            <Link
              href={`/clientes/${cliente.id}`}
              className="truncate max-w-[78%]"
            >
              <h3 className=" text-lg">{cliente.name}</h3>
            </Link>
            {cliente.phone && (
              <Link
                href={`https://wa.me//${cliente.phone
                  ?.toString()
                  .replace(
                    /\D/g,
                    ""
                  )}?text=Bom%20dia!%20Vamos%20engraxar%20hoje?`}
                target="_blank"
                className="flex gap-1"
              >
                <Image
                  className="rounded-full"
                  alt="Ícone Whatsapp"
                  src="/wpp-icon.svg"
                  width={15}
                  height={15}
                />
              </Link>
            )}
          </div>
        </div>
        <Link href={`/dashboard/${cliente.id}`}>
          {cliente.veiculos ? (
            <div className="flex gap-2">
              <span>{cliente.veiculos.length}</span>
              <TruckIcon />
            </div>
          ) : null}
        </Link>
      </div>
    </div>
  );
};

export default CardCliente;
