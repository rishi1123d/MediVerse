"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

interface Anomaly {
  type: string;
  description: string;
  confidence: number;
  timestamp: number;
  emoji: string;
  color: string;
}

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  procedure: string;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  riskFactors: string[];
}

function FinalReportContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId") ?? null;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sample patient data
  const patientData: PatientData = {
    id: patientId || "P12345",
    name: "John Smith",
    age: 45,
    gender: "Male",
    procedure: "Laparoscopic Cholecystectomy",
    medicalHistory: [
      "Hypertension (controlled)",
      "Type 2 Diabetes",
      "Previous appendectomy (2015)"
    ],
    allergies: [
      "Penicillin",
      "Latex"
    ],
    medications: [
      "Metformin 500mg BID",
      "Lisinopril 10mg daily",
      "Aspirin 81mg daily"
    ],
    riskFactors: [
      "BMI: 32",
      "Smoking history: 10 pack-years",
      "Family history of cardiovascular disease"
    ]
  };

  // Mock data for the final report
  const detectedAnomalies: Anomaly[] = [
    {
      type: "stoma_retraction",
      description: "Stoma retraction detected in lower quadrant",
      confidence: 0.88,
      timestamp: 15,
      emoji: "🔄",
      color: "#ff0000"
    },
    {
      type: "excessive_bleeding",
      description: "Excessive bleeding near incision site",
      confidence: 0.92,
      timestamp: 25,
      emoji: "🩸",
      color: "#ff0000"
    },
    {
      type: "tissue_damage",
      description: "Tissue damage in surrounding area",
      confidence: 0.85,
      timestamp: 35,
      emoji: "⚠️",
      color: "#ff0000"
    },
    {
      type: "instrument_misplacement",
      description: "Surgical instrument out of position",
      confidence: 0.78,
      timestamp: 45,
      emoji: "🔧",
      color: "#ffa500"
    },
    {
      type: "suture_issue",
      description: "Irregular suture pattern detected",
      confidence: 0.82,
      timestamp: 55,
      emoji: "🧵",
      color: "#ffa500"
    },
    {
      type: "organ_exposure",
      description: "Unintended organ exposure",
      confidence: 0.90,
      timestamp: 65,
      emoji: "💢",
      color: "#ff0000"
    }
  ];

  const severityCounts = {
    critical: detectedAnomalies.filter(a => a.color === "#ff0000").length,
    moderate: detectedAnomalies.filter(a => a.color === "#ffa500").length
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Surgical Analysis Report</h1>
      <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
        {/* Patient Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Patient Information</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white bg-opacity-5 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Basic Information</h3>
              <div className="space-y-2 text-white">
                <p><span className="font-semibold">Patient ID:</span> {patientData.id}</p>
                <p><span className="font-semibold">Name:</span> {patientData.name}</p>
                <p><span className="font-semibold">Age:</span> {patientData.age}</p>
                <p><span className="font-semibold">Gender:</span> {patientData.gender}</p>
                <p><span className="font-semibold">Procedure:</span> {patientData.procedure}</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-5 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Medical History</h3>
              <div className="space-y-2 text-white">
                <p className="font-semibold">Conditions:</p>
                <ul className="list-disc list-inside">
                  {patientData.medicalHistory.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
                <p className="font-semibold mt-2">Allergies:</p>
                <ul className="list-disc list-inside">
                  {patientData.allergies.map((allergy, index) => (
                    <li key={index}>{allergy}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-5 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Current Medications</h3>
              <ul className="list-disc list-inside text-white">
                {patientData.medications.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white bg-opacity-5 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Risk Factors</h3>
              <ul className="list-disc list-inside text-white">
                {patientData.riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Anomaly Analysis Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Anomaly Analysis</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-500 bg-opacity-20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Critical Anomalies</h3>
              <p className="text-3xl font-bold text-white">{severityCounts.critical}</p>
            </div>
            <div className="bg-orange-500 bg-opacity-20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Moderate Anomalies</h3>
              <p className="text-3xl font-bold text-white">{severityCounts.moderate}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-white">Detected Anomalies Timeline</h3>
          <div className="space-y-4">
            {detectedAnomalies.map((anomaly, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-5 p-4 rounded-lg border-l-4"
                style={{ borderLeftColor: anomaly.color }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{anomaly.emoji}</span>
                    <span className="text-white font-semibold">{anomaly.description}</span>
                  </div>
                  <span className="text-white opacity-80">
                    {Math.round(anomaly.confidence * 100)}% confidence
                  </span>
                </div>
                <div className="text-white opacity-70">
                  Detected at {anomaly.timestamp} seconds
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-white">Recommendations</h3>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-5 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-2">Immediate Actions</h4>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Monitor patient for signs of infection</li>
                <li>Schedule follow-up examination within 24 hours</li>
                <li>Review surgical technique with surgical team</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-5 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-2">Long-term Recommendations</h4>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Implement additional training for surgical team</li>
                <li>Review and update surgical protocols</li>
                <li>Consider additional monitoring equipment</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <a
            href={`/live-detection?patientId=${patientId}`}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
          >
            Back to Detection
          </a>
          {isClient && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              Print Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FinalReport() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FinalReportContent />
    </Suspense>
  );
} 