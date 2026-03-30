import LogoSvg from "@/assets/svg/logo";
// Util Imports
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 *
 * @param {{ className?: string }} param0
 * @param {string} param0.className
 * @returns {*}
 */
const Logo = ({ className }: { className?: string }): JSX.Element => {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoSvg className="size-8.5" />
      <span className="text-xl font-semibold">shadcn/studio</span>
    </div>
  );
};

export default Logo;
