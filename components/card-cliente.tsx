import { Cliente, Veiculo } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ClienteFull extends Cliente {
  veiculos: Veiculo[];
}

const CardCliente = ({ cliente }: { cliente: ClienteFull }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {cliente.imageUrl ? (
        <Image
          className="h-[70px] w-[70px] rounded-full object-cover"
          width={70}
          height={70}
          alt="Imagem do cliente"
          src={cliente.imageUrl}
        />
      ) : (
        <UserIcon size={70} />
      )}
      <div className="flex flex-col items-start overflow-hidden gap-1">
        <Link href={`/clientes/${cliente.id}`}>
          <h3 className="truncate text-lg">{cliente.name}</h3>
        </Link>
        {cliente.phone && (
          <Link
            href={`https://wa.me//${cliente.phone
              ?.toString()
              .replace(/\D/g, "")}?text=Bom%20dia!%20Vamos%20engraxar%20hoje?`}
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
            <p className="text-ring text-sm">{cliente.phone}</p>
          </Link>
        )}
        <Link href={`/dashboard/${cliente.id}`}>
          {cliente.veiculos.length > 1 ? (
            <span className="text-sm italic">
              {cliente.veiculos.length} veículos
            </span>
          ) : (
            <span className="text-sm italic">
              {cliente.veiculos.length} veículo
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default CardCliente;
