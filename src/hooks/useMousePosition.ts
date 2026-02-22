import { useEffect, useRef, useState, useCallback } from "react";

interface MousePos {
  x: number;
  y: number;
}

export function useMouseGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [pos, setPos] = useState<MousePos>({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }, []);

  return { ref, pos, handleMouseMove };
}

export function useCardGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowStyle({
      background: `radial-gradient(400px circle at ${x}px ${y}px, rgba(78, 175, 80, 0.12), transparent 60%)`,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGlowStyle({});
  }, []);

  return { ref, glowStyle, handleMouseMove, handleMouseLeave };
}
