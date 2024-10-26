"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Compilation() {
  const [report, setReport] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Simulating report generation
    const generateReport = async () => {
      // In a real scenario, this would fetch data from your database or API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setReport(`
Patient ID: 12345
Pre-Op Notes: Patient presents with...
Audio Transcription: The patient's vital signs are...
Endoscopy Analysis:
- Anomaly detected at 00:05 - Possible inflammation
- Anomaly detected at 00:12 - Unusual tissue formation
- Anomaly detected at 00:28 - Area requiring further examination

Recommendations:
1. Further examination of detected anomalies
2. Follow-up tests recommended
3. Consult with specialist regarding unusual tissue formation

Next Steps:
- Schedule follow-up appointment
- Prepare detailed briefing for surgical team
      `);
    };

    generateReport();
  }, []);

  const handleDownloadPDF = () => {
    // In a real scenario, this would generate and download a PDF
    alert("PDF download functionality would be implemented here.");
  };

  const handleNewPatient = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-4xl font-bold mb-6 text-white text-center">
          Compilation Report
        </h1>
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <pre className="text-white whitespace-pre-wrap font-mono text-sm">
            {report}
          </pre>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-md hover:from-purple-500 hover:to-blue-500 transition-all duration-300 font-semibold"
          >
            Download PDF
          </button>
          <button
            onClick={handleNewPatient}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-md hover:from-green-500 hover:to-blue-500 transition-all duration-300 font-semibold"
          >
            New Patient
          </button>
        </div>
      </div>
    </div>
  );
}
