import { ItemsMenuOptions } from "@/constants/nav-menu";
import { Card, CardContent } from "./ui/card";
import {
  CalendarArrowDownIcon,
  CalendarArrowUp,
  CalendarCheck2Icon,
  FileTextIcon,
  ListCollapseIcon,
  LucideCalendarArrowUp,
  SettingsIcon,
  TruckIcon,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const ItemMenu = ({
  itemMenu,
  action,
  classname,
}: {
  itemMenu: Pick<ItemsMenuOptions, "href" | "title">;
  action: Function;
  classname?: HTMLAttributes<HTMLElement>["className"];
}) => {
  const itemIcon = (icon: string) => {
    switch (icon) {
      case "Clientes":
        return <User2Icon size={30} />;
      case "Veículos":
        return <TruckIcon size={30} />;
      case "Simples":
        return <CalendarArrowUp size={30} />;
      case "Parcial":
        return <CalendarCheck2Icon size={30} />;
      case "Configurações":
        return <SettingsIcon size={30} />;
      case "Relatórios":
        return <ListCollapseIcon size={30} />;
      case "PDF - Vários atendimentos":
        return <FileTextIcon size={30} />;
      case "Serviços":
        return <CalendarArrowUp size={30} />;
    }
  };
  return (
    <Card
      className={cn("border-none mt-3 p-2 w-[200px] bg-transparent", classname)}
    >
      <CardContent className="p-0 flex items-center justify-start w-full">
        <Link
          onClick={() => action(false)}
          href={itemMenu.href === "/relatorio" ? "/" : itemMenu.href}
          className="flex gap-2 items-center"
        >
          {itemIcon(itemMenu.title)}
          <p>{itemMenu.title}</p>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ItemMenu;
