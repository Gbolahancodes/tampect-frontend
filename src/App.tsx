import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SingleUpload } from './components/SingleUpload';
import { BatchUpload } from './components/BatchUpload';
import { VerdictCard } from './components/VerdictCard';
import { EvidenceTabs } from './components/EvidenceTabs';
import { GuidelinesBanner } from './components/GuidelinesBanner';
import { checkHealth, analyzeDocument, analyzeBatch } from './services/api';
import type { ResultWithPreview } from './types/forensics';
import { ArrowLeft, ArrowRight, AlertCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard, cn } from './components/GlassCard';

function App() {
  const [isOnline, setIsOnline] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'batch'>('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<ResultWithPreview | null>(null);
  const [batchResults, setBatchResults] = useState<ResultWithPreview[]>([]);

  useEffect(() => {
    checkHealth().then(() => setIsOnline(true)).catch(() => setIsOnline(false));
  }, []);

  const handleSingleAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeDocument(file);
      setActiveResult({ ...data, previewUrl: URL.createObjectURL(file), filename: file.name });
    } catch (err) {
      setError("Analysis failed. Unable to reach the server or process the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchAnalyze = async (files: File[]) => {
    setLoading(true);
    setError(null);
    try {
      // Process each file individually in parallel to bypass Render's 30s timeout and RAM limits
      const uploadPromises = files.map(async (file) => {
        const data = await analyzeDocument(file);
        return { 
          ...data, 
          previewUrl: URL.createObjectURL(file), 
          filename: file.name 
        };
      });

      // Wait for all individual requests to finish
      const resultsWithPreview = await Promise.all(uploadPromises);
      setBatchResults(resultsWithPreview);
      
    } catch (err) {
      setError("Batch analysis failed. One or more documents could not be processed.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setActiveResult(null);
    setError(null);
    if (uploadMode === 'single') setBatchResults([]);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 pt-32 pb-12 px-6">
      <Navbar />
      
      <main className="max-w-4xl mx-auto space-y-8">

        {/* Professional In-App Error Banner */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl flex items-center justify-between text-sm backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="p-1 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
        
        {/* State 1: Upload Screens */}
        {!activeResult && batchResults.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold tracking-tighter mb-4">Document Verification</h2>
              <p className="text-white/50">Upload a physical document capture to detect digital forgery.</p>
            </div>
            
            <GuidelinesBanner />
            
            <div className="flex justify-center space-x-4 mb-8">
              <button 
                onClick={() => { setUploadMode('single'); setBatchResults([]); setError(null); }} 
                className={cn("px-6 py-2 rounded-full text-sm font-bold transition-all duration-300", uploadMode === 'single' ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20")}
              >
                Single Upload
              </button>
              <button 
                onClick={() => { setUploadMode('batch'); setError(null); }} 
                className={cn("px-6 py-2 rounded-full text-sm font-bold transition-all duration-300", uploadMode === 'batch' ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20")}
              >
                Batch Processing
              </button>
            </div>

            {uploadMode === 'single' ? (
              <SingleUpload onAnalyze={handleSingleAnalyze} loading={loading} />
            ) : (
              <BatchUpload onAnalyzeBatch={handleBatchAnalyze} loading={loading} />
            )}
          </motion.div>
        )}

        {/* State 2: Batch Results List */}
        {!activeResult && batchResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Batch Results ({batchResults.length})</h2>
              <button onClick={() => setBatchResults([])} className="text-sm font-bold flex items-center gap-2 transition px-4 py-2 rounded-full text-white hover:bg-white/10 border border-white/10">
                <ArrowLeft className="w-4 h-4" /> Start Over
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batchResults.map((res, i) => (
                <GlassCard key={i} onClick={() => setActiveResult(res)} className="flex justify-between items-center group cursor-pointer border-white/10 hover:border-white/30">
                  <div className="flex items-center gap-4">
                    <img src={res.previewUrl} className="w-16 h-16 rounded-xl object-cover border border-white/20" alt="Thumb" />
                    <div>
                      <p className="font-bold text-sm truncate max-w-[180px]">{res.filename}</p>
                      <p className="text-xs font-bold text-white/50 mt-1">Risk Score: {res.master_risk_score}%</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* State 3: Detailed Analysis View (Verdict + Evidence Tabs) */}
        {activeResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={reset} className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition px-4 py-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10 mb-2">
              <ArrowLeft className="w-4 h-4" /> {uploadMode === 'batch' ? "Back to Batch Results" : "Analyze Another"}
            </button>
            
            <VerdictCard result={activeResult} />
            <EvidenceTabs result={activeResult} />
            
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;