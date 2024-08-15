import { Cliente } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CardClienteProps {
  cliente: Cliente;
}

const CardCliente = ({ cliente }: CardClienteProps) => {
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
      <div className="flex flex-col overflow-hidden">
        <h3 className="w-[290px] truncate text-3xl">{cliente.name}</h3>
        <Link
          href={`https://wa.me//${cliente.phone}?text=Bom%20dia!%20Vamos%20engraxar%20hoje?`}
          target="_blank"
          className="flex gap-1"
        >
          <Image
            className="rounded-full"
            alt="Ícone Whatsapp"
            src="./wpp-icon.svg"
            width={15}
            height={15}
          />
          <p className="text-gray-400">{cliente.phone}</p>
        </Link>
        <p className="text-gray-400">{cliente.address}</p>
      </div>
    </div>
  );
};

export default CardCliente;
