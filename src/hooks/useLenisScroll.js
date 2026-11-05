import { useEffect } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export function useLenisScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis;
    let ticker;

    const stop = () => {
      if (!lenis) return;
      gsap.ticker.remove(ticker);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenis = undefined;
      ticker = undefined;
    };

    const start = () => {
      if (lenis || motionPreference.matches) return;

      lenis = new Lenis({ autoRaf: false, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      ticker = time => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      ScrollTrigger.refresh();
    };

    const syncMotionPreference = () => {
      if (motionPreference.matches) stop();
      else start();
    };

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);

    return () => {
      motionPreference.removeEventListener("change", syncMotionPreference);
      stop();
    };
  }, []);
}
