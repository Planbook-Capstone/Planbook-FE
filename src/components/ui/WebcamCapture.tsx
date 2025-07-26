"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, X, RotateCcw, Download } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

export default function WebcamCapture({ onCapture, onClose }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Capture photo
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  // Retake photo
  const retake = () => {
    setCapturedImage(null);
  };

  // Use captured photo
  const usePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  // Switch camera (front/back)
  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: facingMode
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-calsans text-gray-900">Chụp ảnh</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Camera/Preview Area */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
          {!capturedImage ? (
            // Live camera view
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-auto"
                mirrored={facingMode === "user"}
              />
              
              {/* Camera controls overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                {/* Switch camera button */}
                <button
                  onClick={switchCamera}
                  className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
                  title="Đổi camera"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </button>
                
                {/* Capture button */}
                <button
                  onClick={capture}
                  className="p-4 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                  title="Chụp ảnh"
                >
                  <Camera className="w-6 h-6 text-gray-800" />
                </button>
              </div>
            </div>
          ) : (
            // Captured image preview
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-auto"
              />
              
              {/* Preview controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                {/* Retake button */}
                <button
                  onClick={retake}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Chụp lại
                </button>
                
                {/* Use photo button */}
                <button
                  onClick={usePhoto}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Sử dụng ảnh
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-600">
          {!capturedImage ? (
            <p>Nhấn nút camera để chụp ảnh. Sử dụng nút xoay để đổi camera trước/sau.</p>
          ) : (
            <p>Xem lại ảnh và chọn "Sử dụng ảnh" hoặc "Chụp lại".</p>
          )}
        </div>
      </div>
    </div>
  );
}
