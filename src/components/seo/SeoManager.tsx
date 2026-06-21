import { useLocation } from "react-router-dom";
import { useSeo } from "@/hooks/useSeo";
import { resolveSeo } from "@/lib/seo";

/** Sets per-route document head from the current pathname. Rendered once,
 *  inside the router, so client-side navigation updates the head too. */
export function SeoManager() {
  const { pathname } = useLocation();
  useSeo(resolveSeo(pathname));
  return null;
}
