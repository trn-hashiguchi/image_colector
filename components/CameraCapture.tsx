import React, { useRef, useEffect, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let mediaStream: MediaStream;
    const enableStream = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        alert("カメラにアクセスできませんでした。ブラウザの設定でカメラへのアクセスが許可されているか確認してください。");
        onClose();
      }
    };

    enableStream();

    return () => {
      // Cleanup: stop all tracks on unmount
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        onCapture(imageDataUrl);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="relative w-full max-w-lg p-4">
        <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg shadow-lg"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={handleCapture}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105"
        >
          撮影する
        </button>
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
