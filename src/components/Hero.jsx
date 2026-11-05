import { useCallback, useRef, useState } from "react";
import GhostFibers from "./GhostFibers";
import { TechSkills } from "./TechSkills";
import { useGsapScroll } from "../hooks/useGsapScroll";
import "../styles/Hero.css";

export function Hero({ theme, onToggleTheme }) {
  const heroRef = useRef(null);
  const cordPullRef = useRef(null);
  const suppressCordClickRef = useRef(false);
  const [isCordPulling, setIsCordPulling] = useState(false);
  const [isCordReleasing, setIsCordReleasing] = useState(false);

  const handleCordPointerDown = (event) => {
    if (event.button !== 0) return;

    setIsCordReleasing(false);
    setIsCordPulling(true);
    cordPullRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startX: event.clientX,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCordPointerMove = (event) => {
    const pull = cordPullRef.current;
    if (!pull || pull.pointerId !== event.pointerId) return;

    const deltaY = event.clientY - pull.startY;
    const deltaX = event.clientX - pull.startX;
    const pullDistance = Math.max(0, Math.min(34, deltaY));
    const sway = Math.max(-12, Math.min(12, deltaX * 0.45));

    event.currentTarget.style.setProperty("--cord-pull", `${pullDistance}px`);
    event.currentTarget.style.setProperty("--cord-sway", `${sway}deg`);
  };

  const handleCordPointerUp = (event) => {
    const pull = cordPullRef.current;
    if (!pull || pull.pointerId !== event.pointerId) return;

    const deltaY = event.clientY - pull.startY;
    if (deltaY > 12) {
      onToggleTheme();
      suppressCordClickRef.current = true;
      window.setTimeout(() => {
        suppressCordClickRef.current = false;
      }, 0);
    }

    cordPullRef.current = null;
    setIsCordPulling(false);
    setIsCordReleasing(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    event.currentTarget.style.removeProperty("--cord-pull");
    event.currentTarget.style.removeProperty("--cord-sway");
  };

  const handleCordPointerCancel = (event) => {
    cordPullRef.current = null;
    setIsCordPulling(false);
    setIsCordReleasing(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    event.currentTarget.style.removeProperty("--cord-pull");
    event.currentTarget.style.removeProperty("--cord-sway");
  };

  const handleCordClick = (event) => {
    if (suppressCordClickRef.current) {
      suppressCordClickRef.current = false;
      return;
    }

    if (event.detail === 0) onToggleTheme();
  };

  const handleCordAnimationEnd = (event) => {
    if (event.target === event.currentTarget.querySelector(".theme-cord__assembly")) {
      setIsCordReleasing(false);
    }
  };

  const animateHero = useCallback((root, gsap) => {
    const revealTargets = root.querySelectorAll(
      ".hero__brand, .hero__nav a, .hero__theme-toggle, .hero__hello, .hero__meet, .hero__role, .hero__name, .hero__tagline, .hero__bottom > *"
    );

    gsap.from(revealTargets, {
      autoAlpha: 0,
      y: 22,
      duration: 0.8,
      stagger: 0.075,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform",
    });
  }, []);

  useGsapScroll(heroRef, animateHero);

  return (
    <section ref={heroRef} className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-background" aria-hidden="true">
        <GhostFibers
          glowColor={theme === "dark" ? "#D58A70" : "#B65D45"}
          layers={2}
          twist={1.05}
          threads={48}
          fiberStyle="dots"
          depthOfField={0.85}
          hoverEffect="focus"
          intro
          mouseInteraction
          lineColor={theme === "dark" ? "#BBB2A8" : "#C8BEB3"}
          secondaryColor={theme === "dark" ? "#B97A66" : "#D3A18F"}
          gradient="depth"
          waves={1}
          volume={0.7}
          spread={1}
          scale={1}
          rotation={18}
          perspective={0.65}
          density={1}
          thickness={1}
          tips={0}
          foldGlow={1}
          speed={0.24}
          flow={0.25}
          rollSpeed={0.1}
          focusDepth={0}
          particles={0.16}
          sparkle={0.12}
          glow={0.18}
          brightness={0.46}
          vignette={0}
          grain={0.025}
          mouseStrength={1}
          pulseOnClick
          lightMode
        />
      </div>

      <header className="hero__header">
        <a className="hero__brand" href="#home" aria-label="Aditya Sakpal, home">
          <span className="hero__brand-mark" aria-hidden="true">AS</span>
          <span className="hero__brand-copy">
            <strong>Aditya Sakpal</strong>
            <span>Portfolio &amp; CV</span>
          </span>
        </a>

        <nav className="hero__nav" aria-label="Main navigation">
          <a href="#about-me">About</a>
          <a href="#projects">Works</a>
          <a className="hero__hire" href="#contact">Connect</a>
          <button
            className={[
              "hero__theme-toggle",
              theme === "dark" ? "is-dark" : "",
              isCordPulling ? "is-pulling" : "",
              isCordReleasing ? "is-releasing" : "",
            ].filter(Boolean).join(" ")}
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            aria-label={`Dark mode ${theme === "dark" ? "on" : "off"}. Pull the cord to switch to ${theme === "dark" ? "light" : "dark"} mode.`}
            title={`Pull to switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={handleCordClick}
            onPointerDown={handleCordPointerDown}
            onPointerMove={handleCordPointerMove}
            onPointerUp={handleCordPointerUp}
            onPointerCancel={handleCordPointerCancel}
            onAnimationEnd={handleCordAnimationEnd}
          >
            <span className="theme-cord__mount" aria-hidden="true"></span>
            <span className="theme-cord__assembly" aria-hidden="true">
              <span className="theme-cord__line"></span>
              <span className="theme-cord__knot"></span>
              <span className="theme-cord__handle"></span>
            </span>
          </button>
        </nav>
      </header>

      <div className="hero__composition">
        <p className="hero__hello" aria-hidden="true">HI</p>
        <p className="hero__meet" aria-hidden="true">I'M ADI</p>
        <p className="hero__tagline">
          Frontend developer who builds fast, playful interfaces.
        </p>
        <p className="hero__role">Frontend Developer / React Developer</p>
        <h1 className="hero__name" id="hero-title" aria-label="Aditya Sakpal">
          <span>Aditya</span>
          <span>Sakpal</span>
        </h1>
        <svg
          className="hero__sketch"
          viewBox="0 0 1240 650"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path pathLength="1" d="M470 84 C430 142 449 187 421 232 C395 276 427 318 402 357 C378 397 401 442 426 474" />
          <path pathLength="1" d="M475 119 C454 168 467 204 441 246 C422 278 443 313 424 344" />
          <path pathLength="1" d="M775 100 C817 151 790 196 826 232 C855 268 820 306 852 344 C873 370 855 417 825 452" />
          <path pathLength="1" d="M799 146 C821 180 811 211 839 245 C858 268 840 298 862 321" />
          <path pathLength="1" d="M449 94 C457 81 466 79 478 84" />
          <path pathLength="1" d="M809 449 C820 458 830 457 839 450" />
          <path pathLength="1" d="M340 176 l8 -8 m-4 12 0 -12 m8 8 -12 0" />
          <path pathLength="1" d="M902 402 l8 -8 m-4 12 0 -12 m8 8 -12 0" />
        </svg>
        <figure className="hero__portrait">
          <img
            src={theme === "dark"
              ? "/images/aditya-halfbody-cutout-dark.png"
              : "/images/aditya-halfbody-cutout.png"}
            alt="Waist-up mirror portrait of Aditya Sakpal in a dark jacket, holding his phone"
          />
        </figure>
      </div>

      <div className="hero__bottom">
        <div className="hero__availability">
          <span className="hero__availability-dot" aria-hidden="true"></span>
          Available for work
        </div>

        <div className="hero__tools" aria-label="Technology focus">
          <span className="hero__tools-label">Focus</span>
          <TechSkills />
        </div>

        <a className="hero__scroll" href="#projects">
          Scroll Down
        </a>
      </div>
    </section>
  );
}
