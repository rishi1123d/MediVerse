"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CompilationContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId") ?? null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Video Compilation</h1>
      <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Patient ID: {patientId || "Not specified"}
        </h2>
        <p className="text-white opacity-80">
          Video compilation will be displayed here.
        </p>
      </div>
    </div>
  );
}

export default function Compilation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompilationContent />
    </Suspense>
  );
}
