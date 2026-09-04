import type { ForensicResult } from "../types/forensics";

// Strictly require the environment variable injected by Vercel
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("API URL is missing.");
}

export async function checkHealth() {
  // Changed from /health to /api/v1/status to bypass adblockers
  const res = await fetch(`${API_URL}/api/v1/status`);
  return res.json();
}

export async function analyzeDocument(file: File): Promise<ForensicResult> {
  const formData = new FormData();
  formData.append("file", file);
  
  // Added /api/v1/ prefix to fix the 404 error
  const res = await fetch(`${API_URL}/api/v1/analyze`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}

export async function analyzeBatch(files: File[]): Promise<{ total_processed: number, documents: ForensicResult[] }> {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));
  
  // Added /api/v1/ prefix to fix the 404 error
  const res = await fetch(`${API_URL}/api/v1/analyze-batch`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Batch analysis failed");
  return res.json();
}
