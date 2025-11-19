import React, { useState, useRef, useEffect } from 'react';
import { DetectedObject } from '../types';

interface AnnotatedImageProps {
  imageSrc: string;
  objects: DetectedObject[];
}

export const AnnotatedImage: React.FC<AnnotatedImageProps> = ({ imageSrc, objects }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleImageLoad = () => {
    if (imgRef.current) {
      setDimensions({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });
    }
  };

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
        if (imgRef.current) {
            setDimensions({
                width: imgRef.current.clientWidth,
                height: imgRef.current.clientHeight,
            });
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative inline-block w-full rounded-xl overflow-hidden shadow-md bg-slate-900">
      <img
        ref={imgRef}
        src={imageSrc}
        alt="Analysis Target"
        onLoad={handleImageLoad}
        className="w-full h-auto block opacity-90"
      />
      
      {/* SVG Overlay for Bounding Boxes */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{ display: dimensions.width > 0 ? 'block' : 'none' }}
      >
        {objects.map((obj, idx) => {
          const [ymin, xmin, ymax, xmax] = obj.box_2d;
          const x = xmin * dimensions.width;
          const y = ymin * dimensions.height;
          const w = (xmax - xmin) * dimensions.width;
          const h = (ymax - ymin) * dimensions.height;

          return (
            <g key={idx}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke="#3b82f6" // Blue-500
                strokeWidth="2"
                strokeDasharray="4"
                className="animate-[pulse_3s_ease-in-out_infinite]"
              />
              {/* Label Tag */}
              <rect 
                x={x} 
                y={Math.max(0, y - 24)} 
                width={Math.min(120, w)} 
                height={24} 
                fill="#3b82f6" 
                rx="4"
              />
              <text
                x={x + 6}
                y={Math.max(16, y - 7)}
                fill="white"
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {obj.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
