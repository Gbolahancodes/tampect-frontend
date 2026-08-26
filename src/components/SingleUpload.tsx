import { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function SingleUpload({ onAnalyze, loading }: { onAnalyze: (file: File) => void, loading: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <GlassCard className="flex flex-col items-center justify-center p-12 border-dashed border-2 border-white/20 hover:border-white/40 transition-colors">
      <input type="file" accept="image/*" onChange={handleFileChange} id="single-upload" className="hidden" />
      <label htmlFor="single-upload" className="cursor-pointer flex flex-col items-center space-y-4">
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-64 rounded-xl object-contain shadow-2xl border border-white/10" />
        ) : (
          <div className="p-4 rounded-full bg-white/5 border border-white/10">
            <UploadCloud className="w-10 h-10 text-white" />
          </div>
        )}
        <span className="font-medium text-white/80">{file ? file.name : "Select a document to analyze"}</span>
      </label>
      
      {file && (
        <button 
          onClick={() => onAnalyze(file)} 
          disabled={loading} 
          className="mt-8 flex items-center gap-2 px-8 py-3 bg-white hover:bg-white/90 text-black rounded-full font-bold transition-all disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Processing..." : "Run Analysis"}
        </button>
      )}
    </GlassCard>
  );
}