"use client";

import { useState, useRef, useSearchParams } from "react";
import { useRouter } from "next/navigation";

// Mock function for NLX platform integration
const submitToNLX = async (data: any) => {
  console.log("Submitting to NLX:", data);
  // In a real scenario, this would send data to the NLX platform
  return { success: true, message: "Data submitted successfully" };
};

const searchParams = useSearchParams();
const patientId = searchParams.get("patientId");

export default function PreOp() {
  const [typedNotes, setTypedNotes] = useState("");
  const [audioNotes, setAudioNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [patientFile, setPatientFile] = useState<File | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const router = useRouter();

  const handleTypedNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTypedNotes(e.target.value);
  };

  const handleSpeechToText = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          const audioUrl = URL.createObjectURL(event.data);
          setAudioNotes(audioUrl);
        };
        mediaRecorder.current.start();
        setIsRecording(true);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPatientFile(event.target.files[0]);
    } else {
      setPatientFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      patientId,
      typedNotes,
      audioNotes,
      patientFile: patientFile ? patientFile.name : null,
    };
    const result = await submitToNLX(formData);
    if (result.success) {
      router.push(`/video-upload?patientId=${patientId}`);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Pre-Op Data Collection
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-3 text-white">Typed Notes</h2>
          <textarea
            placeholder="Enter pre-op notes here"
            value={typedNotes}
            onChange={handleTypedNotesChange}
            className="w-full p-3 bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded-md focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-white placeholder-opacity-50"
            rows={5}
          />
        </div>

        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-3 text-white">Audio Notes</h2>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSpeechToText}
              className={`px-6 py-2 rounded-md transition-all duration-300 bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-sm`}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            {audioNotes && <audio src={audioNotes} controls className="mt-3" />}
          </div>
        </div>

        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-3 text-white">
            Patient File Upload
          </h2>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="patient-file-upload"
            />
            <label
              htmlFor="patient-file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-white bg-opacity-80 text-gray-800 rounded-md hover:bg-opacity-100 transition-all duration-300"
            >
              Choose File
            </label>
            <span className="ml-3 text-white">
              {patientFile ? patientFile.name : "No file chosen"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white rounded-md hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md hover:shadow-purple-500/30 backdrop-blur-sm border border-purple-400/20 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Submit Pre-Op Data
        </button>
      </form>
    </div>
  );
}
