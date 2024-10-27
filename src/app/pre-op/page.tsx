"use client";

import { useState, useRef } from "react";
import { toast } from "react-hot-toast";

export default function PreOp() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleSpeechToText = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        
        mediaRecorder.current = new MediaRecorder(stream);
        const audioChunks: BlobPart[] = [];

        mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          await uploadAudio(audioBlob);
        };

        mediaRecorder.current.start();
        setIsRecording(true);
        toast.success("Recording started");
      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast.error("Failed to access microphone");
      }
    } else {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        setIsRecording(false);
        toast.success("Recording stopped");
      }
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("audio", audioBlob, "recorded_audio.wav");

    try {
      const response = await fetch("http://localhost:8000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setTranscribedText(result.text);
        toast.success("Audio transcribed and saved successfully!");
      } else {
        throw new Error(result.error || "Failed to process audio");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process audio");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Pre-Op Data Collection
      </h1>
      
      <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-3 text-white">Audio Recording</h2>
        <div className="space-y-4">
          <button
            onClick={handleSpeechToText}
            disabled={isProcessing}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-semibold disabled:opacity-50`}
          >
            {isProcessing 
              ? "Processing..." 
              : isRecording 
                ? "Stop Recording" 
                : "Start Recording"}
          </button>
          
          {transcribedText && (
            <div className="mt-4">
              <h3 className="text-white font-semibold mb-2">Transcribed Text:</h3>
              <div className="bg-white bg-opacity-20 p-3 rounded-md text-white">
                {transcribedText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}