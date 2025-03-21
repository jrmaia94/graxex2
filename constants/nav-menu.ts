export interface ItemsMenuOptions {
  type: "item" | "group";
  title: string;
  href: string;
  group: {
    title: string;
    href: string;
  }[];
}

export const itemsMenu: ItemsMenuOptions[] = [
  {
    type: "item",
    title: "Clientes",
    href: "/clientes",
    group: [],
  },
  {
    type: "item",
    title: "Veículos",
    href: "/veiculos",
    group: [],
  },
  {
    type: "group",
    title: "",
    href: "",
    group: [
      {
        title: "Simples",
        href: "/agendamentos",
      },
      {
        title: "Parcial",
        href: "/agendamento-parcial/0",
      },
    ],
  },
  {
    type: "item",

    title: "Configurações",
    href: "/config",
    group: [],
  },
  {
    type: "item",
    title: "Relatórios",
    href: "/relatorios",
    group: [],
  },
  {
    type: "item",
    title: "PDF - Vários atendimentos",
    href: "/unify-report/0",
    group: [],
  },
];
