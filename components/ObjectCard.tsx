import React, { useEffect, useRef, useState } from 'react';
import { DetectedObject } from '../types';

interface ObjectCardProps {
  objectData: DetectedObject;
  sourceImageSrc: string;
}

export const ObjectCard: React.FC<ObjectCardProps> = ({ objectData, sourceImageSrc }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceImageSrc) return;

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = sourceImageSrc;

    image.onload = () => {
      const [ymin, xmin, ymax, xmax] = objectData.box_2d;
      
      // Calculate pixel coordinates
      const sX = xmin * image.naturalWidth;
      const sY = ymin * image.naturalHeight;
      const sW = (xmax - xmin) * image.naturalWidth;
      const sH = (ymax - ymin) * image.naturalHeight;

      // Add a little padding
      const padding = 0; 
      
      // Set canvas size to the cropped region size
      canvas.width = sW + padding * 2;
      canvas.height = sH + padding * 2;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw specific region
        ctx.drawImage(
          image,
          sX, sY, sW, sH, // Source rect
          padding, padding, sW, sH // Dest rect
        );
        setCroppedImageUrl(canvas.toDataURL('image/png'));
      }
    };
  }, [sourceImageSrc, objectData]);

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      <div className="h-52 bg-stone-100 relative overflow-hidden p-6 flex items-center justify-center">
        {/* Background decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
        
        {croppedImageUrl ? (
          <div className="relative z-10 p-2 bg-white rounded-xl shadow-md transform rotate-1 group-hover:rotate-0 transition-transform duration-300">
            <img 
              src={croppedImageUrl} 
              alt={objectData.name} 
              className="max-h-40 object-contain rounded-lg"
            />
          </div>
        ) : (
          <div className="animate-pulse w-16 h-16 bg-stone-200 rounded-full"></div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col bg-white">
        <div className="flex items-baseline gap-2 mb-3 pb-3 border-b border-stone-100">
          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">名前</span>
          <h3 className="text-xl font-bold text-stone-800">
            {objectData.name}
          </h3>
        </div>
        <div className="flex-1">
           <p className="text-sm text-stone-600 leading-relaxed font-medium">
            {objectData.description}
          </p>
        </div>
      </div>
    </div>
  );
};