"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Analysis() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioNotes, setAudioNotes] = useState("");
  const [analysisScript, setAnalysisScript] = useState("");
  const [liveTranscription, setLiveTranscription] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubePlayerRef = useRef<HTMLIFrameElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const videoType = searchParams.get("type");
    const videoId = searchParams.get("videoId");

    if (videoType === "youtube" && videoId) {
      // Load YouTube video
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.src = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (videoType === "file") {
      // Handle file upload (you may need to implement file storage and retrieval)
      console.log("File upload handling not implemented yet");
    }
  }, [searchParams]);

  useEffect(() => {
    // Simulating computer vision analysis
    const interval = setInterval(() => {
      setAnalysisScript(
        (prev) =>
          prev +
          "Detected anomaly at timestamp 00:0" +
          Math.floor(Math.random() * 10) +
          "\n"
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSpeechToText = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          const audioUrl = URL.createObjectURL(event.data);
          setAudioNotes((prev) => prev + audioUrl + "\n");
        };
        mediaRecorder.current.start();
        setIsRecording(true);

        // Simulating live transcription
        const transcriptionInterval = setInterval(() => {
          setLiveTranscription(
            (prev) =>
              prev +
              "Live transcription: " +
              Math.random().toString(36).substring(7) +
              " "
          );
        }, 1000);

        mediaRecorder.current.onstop = () => {
          clearInterval(transcriptionInterval);
        };
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        setIsRecording(false);
      }
    }
  };

  const handleCompilation = () => {
    router.push("/compilation");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl space-y-6">
        <h1 className="text-4xl font-bold mb-6 text-white">Live Analysis</h1>
        <div className="flex space-x-6 h-[70vh]">
          <div className="w-1/2 flex flex-col space-y-4">
            {searchParams.get("type") === "youtube" ? (
              <iframe
                ref={youtubePlayerRef}
                className="w-full h-3/4 rounded-lg"
                src=""
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                ref={videoRef}
                controls
                className="w-full h-3/4 rounded-lg object-cover"
              >
                <source src="/path-to-your-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <button
              onClick={handleSpeechToText}
              className="px-6 py-3 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-md hover:from-purple-500 hover:to-blue-500 transition-all duration-300 text-lg"
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>
          <div className="w-1/2 flex flex-col space-y-4">
            <div className="h-3/4 bg-white bg-opacity-10 p-4 rounded-lg overflow-auto">
              <h2 className="text-2xl font-semibold mb-3 text-white">
                Analysis Script
              </h2>
              <pre className="text-white whitespace-pre-wrap text-lg">
                {analysisScript}
              </pre>
            </div>
            <div className="h-1/4 bg-white bg-opacity-10 p-4 rounded-lg overflow-auto">
              <h2 className="text-xl font-semibold mb-2 text-white">
                Live Transcription
              </h2>
              <p className="text-white text-lg">{liveTranscription}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleCompilation}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-xl"
        >
          Generate Compilation
        </button>
      </div>
    </div>
  );
}
