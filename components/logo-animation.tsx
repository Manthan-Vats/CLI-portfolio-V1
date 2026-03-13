"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";

interface LogoAnimationProps {
  logoSrc: string;
  width?: number;
  height?: number;
  onAnimationComplete?: () => void;
  className?: string;
  autoStart?: boolean;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({
  logoSrc,
  width = 200,
  height = 200,
  onAnimationComplete,
  className = "",
  autoStart = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const animationIdRef = useRef<number>();
  const imgRef = useRef<HTMLImageElement>();
  const startTimeRef = useRef<number>();

  const drawOutline = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "brightness(0) saturate(0)";
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        if (x === 0 && y === 0) continue;
        ctx.drawImage(img, x, y, canvas.width, canvas.height);
      }
    }
    ctx.filter = "none";
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const drawFillFromBottom = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
    progress: number,
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOutline(ctx, img, canvas);
    ctx.globalCompositeOperation = "source-over";
    ctx.save();
    const clipHeight = canvas.height * progress;
    const clipY = canvas.height - clipHeight;
    ctx.beginPath();
    ctx.rect(0, clipY, canvas.width, clipHeight);
    ctx.clip();
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentTime = Date.now();
    const elapsed = (currentTime - (startTimeRef.current || 0)) / 1000;

    if (elapsed < 0.7) {
      const progress = elapsed / 0.7;
      drawOutline(ctx, img, canvas);
      ctx.globalAlpha = progress;
    } else if (elapsed < 1.5) {
      ctx.globalAlpha = 1;
      const fillProgress = (elapsed - 0.7) / 0.8;
      drawFillFromBottom(ctx, img, canvas, fillProgress);
    } else {
      ctx.globalAlpha = 1;
      drawFillFromBottom(ctx, img, canvas, 1);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
      return;
    }

    animationIdRef.current = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    startTimeRef.current = Date.now();
    animate();
  };

  const stopAnimation = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setIsLoaded(true);
      if (autoStart) {
        startAnimation();
      }
    };
    img.onerror = () => {
      console.error("Failed to load logo image");
    };
    img.src = logoSrc;
    return () => {
      stopAnimation();
    };
  }, [logoSrc, autoStart]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    />
  );
};

export default LogoAnimation;
