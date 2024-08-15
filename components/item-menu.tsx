import { ItemsMenuOptions } from "@/constants/nav-menu";
import { Card, CardContent } from "./ui/card";
import {
  CalendarArrowUp,
  SettingsIcon,
  TruckIcon,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const ItemMenu = ({ itemMenu }: { itemMenu: ItemsMenuOptions }) => {
  const itemIcon = (icon: string) => {
    switch (icon) {
      case "Clientes":
        return <User2Icon size={30} />;
      case "Veículos":
        return <TruckIcon size={30} />;
      case "Agendamentos":
        return <CalendarArrowUp size={30} />;
      case "Configurações":
        return <SettingsIcon size={30} />;
    }
  };
  return (
    <Card className="border-none mt-3 p-2 w-[200px] bg-transparent">
      <CardContent className="p-0 flex items-center justify-start w-full">
        <Link href={itemMenu.href} className="flex gap-2 items-center">
          {itemIcon(itemMenu.title)}
          <p>{itemMenu.title}</p>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ItemMenu;
