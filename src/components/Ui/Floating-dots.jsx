
import { useEffect, useRef } from "react";
import "../../styles/Ui/Floating-dots.css";
const TAU = Math.PI * 2;
const FRAME_MS = 1000 / 60;

export function FloatingDots({
  count = 50,
  color,
  minRadius = 1,
  maxRadius = 3,
  minSpeed = 0.5,
  maxSpeed = 2,
  className = "",
  ...props
}) {
  const canvasRef = useRef(null);
  const fillRef = useRef("currentColor");
  const redrawRef = useRef(() => {});

  // Resolve the dot color and respond to theme changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const update = () => {
      fillRef.current = color ?? getComputedStyle(canvas).color;
      redrawRef.current();
    };

    update();

    if (color) return;

    const observer = new MutationObserver(update);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    return () => observer.disconnect();
  }, [color]);

  // Draw and animate the dots.
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !parent || !ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const dots = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let inView = true;

    const between = (min, max) =>
      min + Math.random() * (max - min);

    const draw = () => {
  ctx.save();

  // Clear the entire canvas before drawing the next frame.
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = fillRef.current;
  ctx.beginPath();

  for (const dot of dots) {
    ctx.moveTo(dot.x + dot.radius, dot.y);
    ctx.arc(dot.x, dot.y, dot.radius, 0, TAU);
  }

  ctx.fill();
  ctx.restore();
};

    const tick = (time) => {
      const step = lastTime
        ? Math.min((time - lastTime) / FRAME_MS, 3)
        : 1;

      lastTime = time;

      for (const dot of dots) {
        dot.y -= dot.speed * step;

        if (dot.y < -dot.radius * 2) {
          dot.x = Math.random() * width;
          dot.y = height + dot.radius;
        }
      }

      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (
        frame ||
        !inView ||
        reducedMotion.matches ||
        !width ||
        !height
      ) {
        return;
      }

      lastTime = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const resize = () => {
      const nextWidth = parent.clientWidth;
      const nextHeight = parent.clientHeight;

      if (!nextWidth || !nextHeight) return;

      if (dots.length === 0) {
        for (let i = 0; i < count; i++) {
          dots.push({
            x: Math.random() * nextWidth,
            y: Math.random() * nextHeight,
            radius: between(minRadius, maxRadius),
            speed: between(minSpeed, maxSpeed),
          });
        }
      } else if (width && height) {
        const scaleX = nextWidth / width;
        const scaleY = nextHeight / height;

        for (const dot of dots) {
          dot.x *= scaleX;
          dot.y *= scaleY;
        }
      }

      width = nextWidth;
      height = nextHeight;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      draw();
      start();
    };

    const onMotionPreferenceChange = () => {
      if (reducedMotion.matches) {
        stop();
        draw();
      } else {
        start();
      }
    };

    redrawRef.current = () => {
      if (!frame) draw();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;

      if (inView) {
        start();
      } else {
        stop();
      }
    });

    intersectionObserver.observe(canvas);

    reducedMotion.addEventListener(
      "change",
      onMotionPreferenceChange
    );

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      reducedMotion.removeEventListener(
        "change",
        onMotionPreferenceChange
      );

      redrawRef.current = () => {};
    };
  }, [count, minRadius, maxRadius, minSpeed, maxSpeed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-slot="floating-dots"
      className={`floating-dots ${className}`}
      {...props}
    />
  );
}

export default FloatingDots;
