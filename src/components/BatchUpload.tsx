import { useState } from 'react';
import { UploadCloud, Loader2, FileImage } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function BatchUpload({ onAnalyzeBatch, loading }: { onAnalyzeBatch: (files: File[]) => void, loading: boolean }) {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <GlassCard className="flex flex-col p-8">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-white/40 transition-colors rounded-xl p-12 mb-6 bg-white/5">
        <input type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) setFiles(Array.from(e.target.files)) }} id="batch-upload" className="hidden" />
        <label htmlFor="batch-upload" className="cursor-pointer flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-white/5 border border-white/10">
            <UploadCloud className="w-10 h-10 text-white" />
          </div>
          <span className="font-medium text-white/80">Click to select multiple documents</span>
          <span className="text-xs text-white/50">{files.length} files selected</span>
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 gap-4">
          <div className="flex items-center gap-3 text-white">
            <FileImage className="w-5 h-5 opacity-80" />
            <span className="text-sm font-medium">{files.length} documents ready</span>
          </div>
          <button onClick={() => onAnalyzeBatch(files)} disabled={loading} className="flex items-center gap-2 px-8 py-2.5 bg-white hover:bg-white/90 text-black rounded-full text-sm font-bold transition-all disabled:opacity-50">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Processing Batch..." : "Analyze All"}
          </button>
        </div>
      )}
    </GlassCard>
  );
}