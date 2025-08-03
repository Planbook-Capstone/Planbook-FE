"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

export const Portal: React.FC<PortalProps> = ({
  children,
  containerId = "modal-root",
}) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create or get the container element
    let containerElement = document.getElementById(containerId);

    if (!containerElement) {
      containerElement = document.createElement("div");
      containerElement.id = containerId;
      containerElement.style.position = "fixed";
      containerElement.style.top = "0";
      containerElement.style.left = "0";
      containerElement.style.width = "100%";
      containerElement.style.height = "100%";
      containerElement.style.zIndex = "999999";
      containerElement.style.pointerEvents = "none";
      document.body.appendChild(containerElement);
    }

    setContainer(containerElement);
    setMounted(true);

    return () => {
      // Clean up if needed
      if (containerElement && containerElement.children.length === 0) {
        document.body.removeChild(containerElement);
      }
    };
  }, [containerId]);

  if (!mounted || !container) {
    return null;
  }

  return createPortal(
    <div style={{ pointerEvents: "auto" }}>{children}</div>,
    container
  );
};
