import { useCallback, useRef } from "react";
import { useGsapScroll } from "../hooks/useGsapScroll";
import "../styles/ConnectMe.css"

export function ConnectMe(){
  const sectionRef = useRef(null);
  const revealContact = useCallback((root, gsap) => {
    gsap.from(root.querySelector("h2"), {
      autoAlpha: 0,
      y: 44,
      clipPath: "inset(0 0 100% 0)",
      duration: 1,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform,clipPath",
      scrollTrigger: {
        trigger: root,
        start: "top 78%",
        once: true,
      },
    });

    gsap.from(root.querySelectorAll(".contact-eyebrow, .diss, .email, .els, .linkedin, .github"), {
      autoAlpha: 0,
      y: 20,
      duration: 0.75,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: {
        trigger: root,
        start: "top 72%",
        once: true,
      },
    });

    const glow = root.querySelector(".contact-glow");
    if (glow) {
      gsap.to(glow, {
        yPercent: -12,
        xPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }
  }, []);

  useGsapScroll(sectionRef, revealContact);

  return(
    <section
      ref={sectionRef}
      id="contact"
      className="connect-section"
      aria-labelledby="contact-title"
    >
      <div className="contact-glow" aria-hidden="true"></div>
      <div className="left">
        <p className="contact-eyebrow">03 / A good place to start</p>
        <h2 className="lc" id="contact-title">Let's Connect</h2>
        <p className="diss">
          Always interested in new opportunities, collaborations, and conversations about web-development and design.
        </p>
        <a
          className="email"
          href="https://mail.google.com/mail/?view=cm&fs=1&to=adityasakpal16@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Email Me
        </a>
      </div>

      <div className="right">
        <h3 className="els">Elsewhere</h3>
        <a
          className="linkedin"
          href="https://www.linkedin.com/in/aditya-sakpal-95aa32359"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          className="github"
          href="https://github.com/Adi161121"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}