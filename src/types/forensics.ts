export interface ForensicScores {
  ela_score: number;
  laplacian_variance: number;
  laplacian_score: number;
  fft_score: number;
  metadata_score: number;
  ai_risk_score: number;
  ai_confidence: number;
  ai_classification: string;
}

export interface QrRecord {
  type: string;
  data: string;
}

export interface ForensicResult {
  filename?: string;
  verdict: "HIGH_RISK_FORGERY" | "MEDIUM_RISK_REVIEW" | "LOW_RISK_AUTHENTIC";
  master_risk_score: number;
  document_type: string;
  analysis_text?: string;
  quality_alerts: {
    is_screenshot: boolean;
    is_blurry: boolean;
  };
  scores: ForensicScores;
  metadata: {
    flags: string[];
    raw_exif: Record<string, string>;
  };
  qr_payloads: {
    detected: boolean;
    count: number;
    payloads: string[];
    records: QrRecord[];
  };
  heatmaps: {
    ela_base64: string;
    laplacian_base64: string;
    fft_base64: string;
  };
}

export interface ResultWithPreview extends ForensicResult {
  previewUrl: string;
  filename: string;
}