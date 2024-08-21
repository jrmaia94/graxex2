import { Loader2Icon } from "lucide-react";

const Loader = () => {
  return (
    <div
      className="absolute top-0 right-0 flex w-full h-full justify-center items-center"
      style={{ backgroundColor: "rgba(50, 50, 50, 0.5)" }}
    >
      <style>{`
            @keyframes spin {
                 0% {transform: rotate(0deg)}
                 100% {transform: rotate(720deg)}
            }
        `}</style>
      <Loader2Icon
        size={50}
        style={{
          animation: "spin 2s infinite",
        }}
      />
    </div>
  );
};

export default Loader;
