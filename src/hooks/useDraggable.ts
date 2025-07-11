import { useEffect, useRef } from "react";

export const useDraggable = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pos = { x: 0, y: 0 };
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      pos = {
        x: e.clientX - el.offsetLeft,
        y: e.clientY - el.offsetTop,
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newLeft = e.clientX - pos.x;
      const newTop = e.clientY - pos.y;

      const maxX = window.innerWidth - el.offsetWidth;
      const maxY = window.innerHeight - el.offsetHeight;

      el.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
      el.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    el.addEventListener("mousedown", onMouseDown);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return ref;
};
