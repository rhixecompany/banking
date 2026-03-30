import { GlobeIcon, LinkIcon, Share2Icon, VideoIcon } from "lucide-react";
/**
 * Description placeholder
 *
 * @returns {*}
 */

import Logo from "@/components/shadcn-studio/logo";
import { Separator } from "@/components/ui/separator";

/**
 * Description placeholder
 *
 * @returns {JSX.Element}
 */
const Footer = (): JSX.Element => {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-4  max-md:flex-col sm:p-6  md:gap-6 md:py-8">
        <a href="#">
          <div className="flex items-center gap-3">
            <Logo className="gap-3" />
          </div>
        </a>

        <div className="flex items-center gap-5 whitespace-nowrap">
          <a
            href="#"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            About
          </a>
          <a
            href="#"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Features
          </a>
          <a
            href="#"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Works
          </a>
          <a
            href="#"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Career
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#">
            <GlobeIcon className="size-5" />
          </a>
          <a href="#">
            <Share2Icon className="size-5" />
          </a>
          <a href="#">
            <LinkIcon className="size-5" />
          </a>
          <a href="#">
            <VideoIcon className="size-5" />
          </a>
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6">
        <p className="text-center font-medium text-balance">
          {`©${new Date().getFullYear()}`}{" "}
          <a href="#" className="hover:underline">
            shadcn/studio
          </a>
          , Made with ❤️ for better web.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
