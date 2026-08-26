import { ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { GlassCard, cn } from './GlassCard';
import type { ResultWithPreview } from '../types/forensics';

export function VerdictCard({ result }: { result: ResultWithPreview }) {
  const isHighRisk = result.verdict === "HIGH_RISK_FORGERY";
  const isMediumRisk = result.verdict === "MEDIUM_RISK_REVIEW";
  
  const Icon = isHighRisk ? ShieldAlert : isMediumRisk ? AlertTriangle : ShieldCheck;

  return (
    <div className="space-y-4">
      <GlassCard className="flex flex-col md:flex-row items-start md:items-center justify-between border-white/20">
        <div className="flex items-center space-x-5">
          <Icon className="w-10 h-10 md:w-12 md:h-12 text-white opacity-90" />
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">{result.verdict.replace(/_/g, " ")}</h2>
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:text-right">
          <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">{result.master_risk_score}%</span>
          <span className="block text-xs uppercase tracking-wider text-white/50 font-bold mt-1">Overall Risk Score</span>
        </div>
      </GlassCard>
      
      <GlassCard>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">Analysis</h3>
        <p className="text-sm font-medium text-white/90">{result.analysis_text}</p>
        
        {(result.quality_alerts.is_screenshot || result.quality_alerts.is_blurry) && (
          <div className="mt-4 flex flex-col gap-2">
            {result.quality_alerts.is_screenshot && (
              <div className="flex items-center gap-2 text-white text-xs font-semibold bg-white/10 border border-white/20 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" /> Screenshot detected. Hardware metadata is missing.
              </div>
            )}
            {result.quality_alerts.is_blurry && (
              <div className="flex items-center gap-2 text-white text-xs font-semibold bg-white/10 border border-white/20 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" /> Low sharpness detected. Image may be out of focus.
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}