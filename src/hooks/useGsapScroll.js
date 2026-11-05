import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapScroll(scopeRef, setup) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    const media = gsap.matchMedia(scope);
    media.add("(prefers-reduced-motion: no-preference)", () => setup(scope, gsap, ScrollTrigger));

    return () => media.revert();
  }, [scopeRef, setup]);
}
