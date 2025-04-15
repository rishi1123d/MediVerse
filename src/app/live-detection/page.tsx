"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface DetectionBox {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  confidence: number;
  description: string;
}

function LiveDetectionContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId") ?? null;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [detectionBoxes, setDetectionBoxes] = useState<DetectionBox[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoComplete, setIsVideoComplete] = useState(false);

  // More specific surgical anomaly types
  const surgicalAnomalies = [
    {
      type: "stoma_retraction",
      description: "Stoma Retraction",
      color: "#ff0000",
      emoji: "🔄"
    },
    {
      type: "excessive_bleeding",
      description: "Excessive Bleeding",
      color: "#ff0000",
      emoji: "🩸"
    },
    {
      type: "tissue_damage",
      description: "Tissue Damage",
      color: "#ff0000",
      emoji: "⚠️"
    },
    {
      type: "instrument_misplacement",
      description: "Instrument Misplacement",
      color: "#ffa500",
      emoji: "🔧"
    },
    {
      type: "suture_issue",
      description: "Suture Issue",
      color: "#ffa500",
      emoji: "🧵"
    },
    {
      type: "organ_exposure",
      description: "Organ Exposure",
      color: "#ff0000",
      emoji: "💢"
    }
  ];

  // Optimized detection simulation
  const simulateDetection = useCallback(() => {
    // Change detections every 10 seconds
    const timeWindow = Math.floor(currentTime / 10);
    const mockDetections: DetectionBox[] = [];
    
    // Clear detections if we're in a new time window
    if (timeWindow !== Math.floor((currentTime - 0.1) / 10)) {
      setDetectionBoxes([]);
      return;
    }
    
    // Only show detections for the first 8 seconds of each window
    const windowProgress = currentTime % 10;
    if (windowProgress > 8) {
      setDetectionBoxes([]);
      return;
    }
    
    switch (timeWindow % 6) { // Cycle through 6 different detections
      case 0:
        mockDetections.push({
          x: 150,
          y: 120,
          width: 180,
          height: 180,
          type: "stoma_retraction",
          confidence: 0.88,
          description: "Stoma retraction detected in lower quadrant"
        });
        break;
      case 1:
        mockDetections.push({
          x: 200,
          y: 150,
          width: 120,
          height: 100,
          type: "excessive_bleeding",
          confidence: 0.92,
          description: "Excessive bleeding near incision site"
        });
        break;
      case 2:
        mockDetections.push({
          x: 180,
          y: 200,
          width: 150,
          height: 120,
          type: "tissue_damage",
          confidence: 0.85,
          description: "Tissue damage in surrounding area"
        });
        break;
      case 3:
        mockDetections.push({
          x: 250,
          y: 180,
          width: 100,
          height: 100,
          type: "instrument_misplacement",
          confidence: 0.78,
          description: "Surgical instrument out of position"
        });
        break;
      case 4:
        mockDetections.push({
          x: 220,
          y: 160,
          width: 140,
          height: 140,
          type: "suture_issue",
          confidence: 0.82,
          description: "Irregular suture pattern detected"
        });
        break;
      case 5:
        mockDetections.push({
          x: 190,
          y: 140,
          width: 160,
          height: 160,
          type: "organ_exposure",
          confidence: 0.90,
          description: "Unintended organ exposure"
        });
        break;
    }

    setDetectionBoxes(mockDetections);
  }, [currentTime]);

  // Optimized canvas rendering
  const drawDetectionBoxes = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const video = videoRef.current;

    if (!canvas || !ctx || !video) return;

    // Set canvas size to match video
    if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
    }

    // Clear canvas efficiently
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    detectionBoxes.forEach(box => {
      const anomaly = surgicalAnomalies.find(a => a.type === box.type);
      const color = anomaly?.color || '#00ff00';
      
      // Draw box with anti-aliasing
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Draw label background
      const label = `${anomaly?.emoji || ''} ${box.description} (${Math.round(box.confidence * 100)}%)`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(box.x, box.y - 25, textWidth + 10, 20);

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.fillText(label, box.x + 5, box.y - 10);
    });
  }, [detectionBoxes, surgicalAnomalies]);

  // Animation loop
  const animate = useCallback(() => {
    if (isPlaying) {
      const video = videoRef.current;
      if (video) {
        setCurrentTime(video.currentTime);
        simulateDetection();
        drawDetectionBoxes();
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, simulateDetection, drawDetectionBoxes]);

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const video = videoRef.current;
      if (video) {
        video.src = URL.createObjectURL(file);
        setDetectionBoxes([]);
        setCurrentTime(0);
        setIsVideoComplete(false);
      }
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsVideoComplete(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Live Surgical Anomaly Detection</h1>
      <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Patient ID: {patientId || "Not specified"}
        </h2>

        <div className="relative mb-4">
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            controls={false}
            onEnded={handleVideoEnded}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          />
        </div>

        <div className="flex space-x-4 mb-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            id="video-input"
          />
          <label
            htmlFor="video-input"
            className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Choose Video
          </label>
          <button
            onClick={togglePlay}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          {isVideoComplete && (
            <a
              href={`/final?patientId=${patientId}`}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              Next: View Final Report
            </a>
          )}
        </div>

        {isVideoComplete && (
          <div className="mb-4 p-3 bg-green-500 bg-opacity-20 rounded-lg">
            <p className="text-white text-center">
              Video analysis complete! Click "Next" to view the final report.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Current Detections:</h3>
          {detectionBoxes.length > 0 ? (
            detectionBoxes.map((box, index) => {
              const anomaly = surgicalAnomalies.find(a => a.type === box.type);
              return (
                <div key={index} className="bg-white bg-opacity-5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white">
                      {anomaly?.emoji} {box.description}
                    </span>
                    <span className="text-white opacity-80">
                      {Math.round(box.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white opacity-80">No anomalies detected</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveDetection() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LiveDetectionContent />
    </Suspense>
  );
} 