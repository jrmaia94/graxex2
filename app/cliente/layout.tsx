import HeaderClientPage from "@/components/headerClientPage";

const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <HeaderClientPage />
      {children}
    </>
  );
};

export default ClientLayout;
