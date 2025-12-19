"use client";
import Snowfall from "react-snowfall";

export const SnowfallComponent = () => {
  return (
    <div className="w-screen h-screen fixed">
      <Snowfall enable3DRotation color="#bdd4da" />
    </div>
  );
};
