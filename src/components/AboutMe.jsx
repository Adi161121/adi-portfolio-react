import { useCallback, useEffect, useRef, useState } from "react";
import { useGsapScroll } from "../hooks/useGsapScroll";
import "../styles/AboutMe.css";

const aboutWords = [
  "Frontend Development",
  "Creative Thinking",
  "UI / UX Design",
  "Problem Solving",
  "Always Learning",
];

export function AboutMe() {
  const sectionRef = useRef(null);
  const wordStackRef = useRef(null);
  const [activeWord, setActiveWord] = useState(0);

  useEffect(() => {
    const stack = wordStackRef.current;
    if (!stack) return undefined;

    let frame = 0;
    const updateActiveWord = () => {
      frame = 0;
      const words = [...stack.querySelectorAll(".about-word")];
      if (!words.length) return;

      const stackCenter = stack.getBoundingClientRect().top + stack.clientHeight / 2;
      const nearestWord = words.reduce((nearest, word, index) => {
        const wordCenter = word.getBoundingClientRect().top + word.offsetHeight / 2;
        const distance = Math.abs(wordCenter - stackCenter);
        return distance < nearest.distance ? { index, distance } : nearest;
      }, { index: 0, distance: Infinity });

      setActiveWord((current) => current === nearestWord.index ? current : nearestWord.index);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveWord);
    };

    stack.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();
    return () => {
      stack.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const revealAbout = useCallback((root, gsap) => {
    gsap.from(
      root.querySelectorAll(".about-eyebrow, .about-intro h2, .about-intro p, .about-connect"),
      {
        autoAlpha: 0,
        y: 22,
        duration: 0.75,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          once: true,
        },
      }
    );
  }, []);

  useGsapScroll(sectionRef, revealAbout);

  return (
    <section
      ref={sectionRef}
      id="about-me"
      aria-labelledby="about-title"
    >
      <div className="about-intro">
        <p className="about-eyebrow">01 / A little about me</p>
        <h2 id="about-title">Hey, I’m Adi. I build things for the web.</h2>
        <p>
          I’m a frontend developer who enjoys turning ideas into modern web
          experiences. I work with React, care about thoughtful UI design, and
          like adding motion where it helps. I’m always learning, experimenting,
          and finding better ways to build for the web.
        </p>
        <a className="about-connect" href="#contact">
          [ Let’s connect ]
        </a>
      </div>

      <div
        ref={wordStackRef}
        className="about-word-stack"
        role="region"
        aria-label="Areas of focus. Scroll to explore."
        tabIndex={0}
        data-lenis-prevent-wheel
      >
        {aboutWords.map((word, index) => {
          const distance = Math.abs(index - activeWord);

          return (
            <p
              className={`about-word ${
                distance === 0 ? "is-active" : distance === 1 ? "is-near" : "is-far"
              }`}
              key={word}
              aria-current={distance === 0 ? "true" : undefined}
            >
              {word}
            </p>
          );
        })}
      </div>
    </section>
  );
}
