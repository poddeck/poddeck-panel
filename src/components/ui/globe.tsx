import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';
import { useTheme } from "next-themes";

export interface GlobeMarker {
  location: [number, number];
  size: number;
}

interface GlobeProps {
  className?: string;
  markers: GlobeMarker[];
}

export function Globe({ className, markers }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef(false);
  const pointerInteractionMovement = useRef(0);
  const { theme } = useTheme();

  useEffect(() => {
    let phi = 4.5;
    let width = 0;

    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: theme === "light" ? 0 : 1,
      diffuse: 1.2,
      mapSamples: 24000,
      mapBrightness: 6,
      baseColor: theme === "light" ? [0.7, 0.7, 0.7] : [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.5, 0.5, 0.5],
      scale: 1.1,
      markers: markers,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.005;
        }

        phi += pointerInteractionMovement.current;

        pointerInteractionMovement.current *= 0.9;

        state.phi = phi;

        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [theme, markers]);

  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="duration-500"
        style={{ width: 500, maxWidth: '100%', aspectRatio: 1, cursor: 'grab' }}
        onPointerDown={() => {
          pointerInteracting.current = true;
          canvasRef.current!.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = false;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = false;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current) {
            const delta = e.movementX;
            pointerInteractionMovement.current = delta * 0.005;
          }
        }}
      />
    </div>
  );
}