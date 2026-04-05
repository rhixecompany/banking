import { Loader2 } from "lucide-react";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @returns {JSX.Element}
 */
const MyLoader = (): JSX.Element => {
  return (
    <>
      <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
    </>
  );
};

export default MyLoader;
