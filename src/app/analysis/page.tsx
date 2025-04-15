"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

interface Anomaly {
  timestamp: string;
  type: string;
  confidence: number;
  description: string;
}

interface DetectionResults {
  anomalies: Anomaly[];
  summary: string;
}

interface SurgicalReport {
  patientInfo: {
    id: string;
    name: string;
    age: number;
    gender: string;
    procedure: string;
  };
  preOpData: {
    notes: string;
    riskFactors: string[];
    medications: string[];
  };
  intraOpData: {
    anomalies: Anomaly[];
    duration: string;
    bloodLoss: string;
    complications: string[];
  };
  postOpRecommendations: {
    monitoring: string[];
    medications: string[];
    followUp: string;
  };
}

function AnalysisContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId") ?? null;
  const resultsParam = searchParams?.get("results");
  const results: DetectionResults | null = resultsParam ? JSON.parse(decodeURIComponent(resultsParam)) : null;

  // Mock surgical report data (in a real app, this would come from the PDF and other sources)
  const [report] = useState<SurgicalReport>({
    patientInfo: {
      id: patientId || "N/A",
      name: "John Doe",
      age: 45,
      gender: "Male",
      procedure: "Laparoscopic Cholecystectomy"
    },
    preOpData: {
      notes: "Patient presented with chronic cholecystitis. No significant comorbidities.",
      riskFactors: ["Hypertension", "BMI > 30"],
      medications: ["Metoprolol", "Aspirin"]
    },
    intraOpData: {
      anomalies: results?.anomalies || [],
      duration: "2 hours 15 minutes",
      bloodLoss: "250ml",
      complications: ["Minor bleeding", "Adhesion formation"]
    },
    postOpRecommendations: {
      monitoring: [
        "Vital signs every 4 hours",
        "Pain assessment",
        "Wound inspection",
        "Drain output monitoring"
      ],
      medications: [
        "IV antibiotics for 24 hours",
        "Pain management as needed",
        "Prophylactic anticoagulation"
      ],
      followUp: "Schedule follow-up in 2 weeks"
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Surgical Analysis Report</h1>
      
      <div className="space-y-6">
        {/* Patient Information */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-white">Patient Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white opacity-80">Patient ID: {report.patientInfo.id}</p>
              <p className="text-white opacity-80">Name: {report.patientInfo.name}</p>
              <p className="text-white opacity-80">Age: {report.patientInfo.age}</p>
              <p className="text-white opacity-80">Gender: {report.patientInfo.gender}</p>
            </div>
            <div>
              <p className="text-white opacity-80">Procedure: {report.patientInfo.procedure}</p>
              <p className="text-white opacity-80">Duration: {report.intraOpData.duration}</p>
              <p className="text-white opacity-80">Blood Loss: {report.intraOpData.bloodLoss}</p>
            </div>
          </div>
        </div>

        {/* Pre-Operative Data */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-white">Pre-Operative Assessment</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Notes</h3>
              <p className="text-white opacity-80">{report.preOpData.notes}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Risk Factors</h3>
              <ul className="list-disc list-inside text-white opacity-80">
                {report.preOpData.riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Current Medications</h3>
              <ul className="list-disc list-inside text-white opacity-80">
                {report.preOpData.medications.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Intra-Operative Findings */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-white">Intra-Operative Findings</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Detected Anomalies</h3>
              {report.intraOpData.anomalies.length > 0 ? (
                <div className="space-y-2">
                  {report.intraOpData.anomalies.map((anomaly, index) => (
                    <div key={index} className="bg-white bg-opacity-5 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-white">{anomaly.description}</span>
                        <span className="text-white opacity-80">
                          {Math.round(anomaly.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-white opacity-80 text-sm mt-1">
                        Timestamp: {anomaly.timestamp}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white opacity-80">No anomalies detected during procedure</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Complications</h3>
              <ul className="list-disc list-inside text-white opacity-80">
                {report.intraOpData.complications.map((complication, index) => (
                  <li key={index}>{complication}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Post-Operative Recommendations */}
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-white">Post-Operative Recommendations</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Monitoring Requirements</h3>
              <ul className="list-disc list-inside text-white opacity-80">
                {report.postOpRecommendations.monitoring.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Medications</h3>
              <ul className="list-disc list-inside text-white opacity-80">
                {report.postOpRecommendations.medications.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Follow-Up</h3>
              <p className="text-white opacity-80">{report.postOpRecommendations.followUp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Analysis() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
