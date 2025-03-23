import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex p-4 pt-[90px] w-full h-full justify-center">
      {children}
    </div>
  );
};

export default Layout;
