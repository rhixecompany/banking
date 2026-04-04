import { redirect } from "next/navigation";

/**
 * This route has been moved to app/page.tsx (root-level, public).
 * Redirect any direct hits to the canonical home URL.
 */
export default function RootHomePage(): never {
  redirect("/");
}
