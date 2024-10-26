import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [patientId, setPatientId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId) {
      router.push(`/pre-op?patientId=${patientId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-4 text-white">MediVerse</h1>
      <p className="text-xl mb-8 text-white">
        Revolutionizing Pre-Surgical Care
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          className="w-full px-4 py-2 rounded-md bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-50 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        />
        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-md hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-purple-500/30 backdrop-blur-sm border border-purple-400/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
