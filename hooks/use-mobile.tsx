import * as React from "react";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {768}
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @returns {boolean}
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
