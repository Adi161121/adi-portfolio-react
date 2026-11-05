import { useCallback, useRef } from "react";
import { useGsapScroll } from "../hooks/useGsapScroll";
import "../styles/MyProject.css";

const projects = [
  {
    year: "2026",
    title: "Passport Photo Maker",
    description:
      "Passport Photo Maker is a web tool that helps users create passport-size photos instantly. It automatically resizes images to meet standard photo requirements and allows quick download of the formatted photo.",
    image: "project wallpaper/paasportly.png",
    imageAlt: "Passport Photo Maker web app",
    category: "Professional",
    technologies: ["JavaScript", "CSS", "HTML"],
    github: "https://github.com/Adi161121/passport-photo-maker",
    demo: "https://passport-photo-maker-7tc2.onrender.com/",
  },
  {
    year: "2025",
    title: "Crunchyroll Clone",
    description:
      "A Crunchyroll-style frontend clone that recreates the layout and user interface of an anime streaming platform. Built to practice responsive design, navigation menus, and interactive UI components.",
    image: "project wallpaper/crucnyroll-clone.png",
    imageAlt: "Crunchyroll-inspired anime streaming interface",
    category: "Personal",
    technologies: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Adi161121/crunchyroll-clone",
    demo: "https://crunchyrollclonee.netlify.app/",
  },
  {
    year: "2025",
    title: "PenCode – Online Code Editor",
    description:
      "A browser-based code editor built with React that allows users to write HTML, CSS, and JavaScript in separate panels and instantly preview the output. The project focuses on component-based architecture, real-time rendering, and interactive UI design.",
    image: "project wallpaper/PenCode.png",
    imageAlt: "PenCode online code editor",
    category: "Professional",
    technologies: ["React", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/Adi161121?tab=repositories",
    demo: "https://pencodee.netlify.app/",
  },
  {
    year: "2025",
    title: "Cara – E-commerce Website",
    description:
      "A responsive fashion e-commerce website featuring product listings, navigation menus, and a modern online store layout.",
    image: "project wallpaper/cara.png",
    imageAlt: "Cara fashion e-commerce website",
    category: "Personal",
    technologies: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Adi161121/Ecommerce-website",
    demo: "https://adi161121.github.io/Ecommerce-website/",
  },
];

const cardDepths = [8, 15, 20, 24];

function handleCardPointerMove(event) {
  if (
    event.pointerType !== "mouse" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const pointerX = (event.clientX - bounds.left) / bounds.width;
  const pointerY = (event.clientY - bounds.top) / bounds.height;
  const offsetX = pointerX - 0.5;
  const offsetY = pointerY - 0.5;

  card.style.setProperty("--tilt-x", `${-offsetY * 4}deg`);
  card.style.setProperty("--tilt-y", `${offsetX * 4}deg`);
  card.style.setProperty("--spot-x", `${pointerX * 100}%`);
  card.style.setProperty("--spot-y", `${pointerY * 100}%`);

  card.querySelectorAll("[data-card-depth]").forEach((layer) => {
    const depth = Number(layer.dataset.cardDepth);
    layer.style.setProperty("--layer-x", `${offsetX * depth}px`);
    layer.style.setProperty("--layer-y", `${offsetY * depth}px`);
  });
}

function resetCardPointer(event) {
  const card = event.currentTarget;
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
  card.style.setProperty("--spot-x", "50%");
  card.style.setProperty("--spot-y", "50%");

  card.querySelectorAll("[data-card-depth]").forEach((layer) => {
    layer.style.setProperty("--layer-x", "0px");
    layer.style.setProperty("--layer-y", "0px");
  });
}

export function MyProject() {
  const sectionRef = useRef(null);
  const revealProjects = useCallback((root, gsap) => {
    gsap.from(root.querySelector("h2"), {
      autoAlpha: 0,
      y: 32,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: {
        trigger: root,
        start: "top 82%",
        once: true,
      },
    });

    root.querySelectorAll(".project-card").forEach((card, index) => {
      gsap.from(card, {
        autoAlpha: 0,
        y: 30,
        rotateX: 3,
        transformOrigin: "center bottom",
        duration: 0.75,
        delay: index * 0.1,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: {
          trigger: card,
          start: "top 86%",
          once: true,
        },
      });

      gsap.from(card.querySelectorAll(".project-card__details > *"), {
        autoAlpha: 0,
        y: 14,
        duration: 0.55,
        delay: 0.16 + index * 0.1,
        stagger: 0.055,
        ease: "power2.out",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: {
          trigger: card,
          start: "top 86%",
          once: true,
        },
      });

      const image = card.querySelector("img");
      if (image) {
        gsap.fromTo(
          image,
          { clipPath: "inset(0 100% 0 0)", scale: 1.06 },
          {
            clipPath: "inset(0 0% 0 0)",
            scale: 1,
            duration: 1.05,
            delay: index * 0.1,
            ease: "power2.inOut",
            clearProps: "clipPath,transform",
            scrollTrigger: {
              trigger: image,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    });
  }, []);

  useGsapScroll(sectionRef, revealProjects);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-labelledby="projects-title"
    >
      <h2 id="projects-title">My Projects</h2>

      <div className="projects-wrapper">
        {projects.map((project) => (
          <article
            className="project-card"
            key={project.title}
            onPointerMove={handleCardPointerMove}
            onPointerLeave={resetCardPointer}
          >
            <div
              className="project-card__year"
              data-card-depth={cardDepths[0]}
            >
              <span>{project.year}</span>
              <span className="tag">{project.category}</span>
            </div>

            <a
              className="project-card__preview"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open live demo: ${project.title}`}
              data-card-depth={cardDepths[1]}
            >
              <img src={project.image} alt={project.imageAlt} />
              <span className="project-card__preview-label" aria-hidden="true">
                View project
                <span>↗</span>
              </span>
            </a>

            <div
              className="project-card__details"
              data-card-depth={cardDepths[2]}
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <ul
                className="project-card__stack"
                aria-label={`${project.title} technology stack`}
              >
                {project.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>

              <div className="project-card__actions">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View live demo of ${project.title}`}
                >
                  Live Demo <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
