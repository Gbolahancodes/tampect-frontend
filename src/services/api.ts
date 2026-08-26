import type { ForensicResult } from "../types/forensics";

// This automatically uses your laptop's IP when viewed on the phone!
// Strictly require the environment variable injected by Vercel
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("API URL is missing.");
}
export async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  return res.json();
}

export async function analyzeDocument(file: File): Promise<ForensicResult> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/analyze`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}

export async function analyzeBatch(files: File[]): Promise<{ total_processed: number, documents: ForensicResult[] }> {
  const formData = new FormData();
  files.forEach(f => formData.append("files", f));
  const res = await fetch(`${API_URL}/analyze-batch`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Batch analysis failed");
  return res.json();
}