"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

const Home = () => {
  const { data, status } = useSession({
    required: true,
  });

  return (
    <div>
      <Image
        alt="Foto graxex"
        src="/background.jpeg"
        className="max-h-[300px] object-cover opacity-80"
        height={1000}
        width={1000}
      />
    </div>
  );
};

export default Home;
