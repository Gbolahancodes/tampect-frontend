import { useState } from 'react';
import { Activity, Map, QrCode, Code } from 'lucide-react';
import { GlassCard, cn } from './GlassCard';
import type { ResultWithPreview } from '../types/forensics';

export function EvidenceTabs({ result }: { result: ResultWithPreview }) {
  const [active, setActive] = useState<'laplacian' | 'ela' | 'qr' | 'metadata'>('laplacian');
  const tabs = [ 
    { id: 'laplacian', label: 'Laplacian Grain', icon: Activity }, 
    { id: 'ela', label: 'ELA Heatmap', icon: Map }, 
    { id: 'qr', label: 'QR/Barcode', icon: QrCode }, 
    { id: 'metadata', label: 'Metadata', icon: Code } 
  ] as const;

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col mt-6">
      <div className="flex overflow-x-auto border-b border-white/10 no-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActive(tab.id as any)} 
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-sm font-bold transition whitespace-nowrap outline-none", 
              active === tab.id ? "border-b-2 border-white text-white bg-white/5" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-6">
        {active === 'laplacian' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="text-xs font-bold uppercase text-white/50 mb-3">Original</p><img src={result.previewUrl} className="w-full rounded-xl border border-white/10 shadow-2xl" alt="Original" /></div>
            <div><p className="text-xs font-bold uppercase text-white/50 mb-3">Noise Map (Var: {result.scores.laplacian_variance})</p><img src={`data:image/jpeg;base64,${result.heatmaps.laplacian_base64}`} className="w-full rounded-xl border border-white/10 shadow-2xl" alt="Laplacian" /></div>
          </div>
        )}
        {active === 'ela' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="text-xs font-bold uppercase text-white/50 mb-3">Original</p><img src={result.previewUrl} className="w-full rounded-xl border border-white/10 shadow-2xl" alt="Original" /></div>
            <div><p className="text-xs font-bold uppercase text-white/50 mb-3">Compression Map (Score: {result.scores.ela_score})</p><img src={`data:image/jpeg;base64,${result.heatmaps.ela_base64}`} className="w-full rounded-xl border border-white/10 shadow-2xl" alt="ELA" /></div>
          </div>
        )}
        {active === 'qr' && (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase text-white/50 mb-3">Extracted Payloads</p>
            {result.qr_payloads.detected ? (
              <div className="space-y-3">
                {result.qr_payloads.records.map((rec, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{rec.type}</span>
                    <p className="font-mono text-sm mt-2 break-all font-medium text-white/90">{rec.data}</p>
                  </div>
                ))}
              </div>
            ) : <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-xl text-white/50 font-medium">No QR code or Barcode detected.</div>}
          </div>
        )}
        {active === 'metadata' && (
          <div className="space-y-6">
            {result.metadata.flags.length > 0 && <div><p className="text-xs font-bold uppercase text-white mb-3">Warnings</p>{result.metadata.flags.map((f, i) => <div key={i} className="p-3 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-medium mb-2">{f}</div>)}</div>}
            <div><p className="text-xs font-bold uppercase text-white/50 mb-3">Raw EXIF Provenance</p><div className="bg-white/5 rounded-xl border border-white/10 p-4 overflow-x-auto"><pre className="text-xs font-mono text-white/80 leading-relaxed">{JSON.stringify(result.metadata.raw_exif, null, 2)}</pre></div></div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}