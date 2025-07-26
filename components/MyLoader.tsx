import { Loader2 } from "lucide-react";
import React from "react";

const MyLoader = () => {
  return (
    <>
      <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
    </>
  );
};

export default MyLoader;
