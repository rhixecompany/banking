import { Loader2 } from "lucide-react";

const MyLoader = (): JSX.Element => {
  return (
    <>
      <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
    </>
  );
};

export default MyLoader;
