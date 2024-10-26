"use client";

import { useState } from "react";

export default function VideoUpload() {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideoFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoFile) {
      // Here you would typically upload the file to your server or cloud storage
      console.log("Uploading video:", videoFile.name);
      // Implement your upload logic here
      alert("Video uploaded successfully!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Video Upload</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-3 text-white">
              Upload Surgery Video
            </h2>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
                id="video-file-upload"
              />
              <label
                htmlFor="video-file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                Choose Video
              </label>
              <span className="ml-3 text-white">
                {videoFile ? videoFile.name : "No file chosen"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!videoFile}
            className={`w-full py-3 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-md hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-purple-500/30 backdrop-blur-sm border border-purple-400/20 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]`}
          >
            Upload Video
          </button>
        </form>
      </div>
    </div>
  );
}
