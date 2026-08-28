import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SingleUpload } from './components/SingleUpload';
import { VerdictCard } from './components/VerdictCard';
import { EvidenceTabs } from './components/EvidenceTabs';
import { GuidelinesBanner } from './components/GuidelinesBanner';
import { checkHealth, analyzeDocument } from './services/api';
import type { ResultWithPreview } from './types/forensics';
import { ArrowLeft, AlertCircle, X } from 'lucide-react';
import { motion } from 'motion/react';

function App() {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<ResultWithPreview | null>(null);

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

  const reset = () => {
    setActiveResult(null);
    setError(null);
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
        
        {/* State 1: Upload Screen */}
        {!activeResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold tracking-tighter mb-4">Document Verification</h2>
              <p className="text-white/50">Upload a physical document capture to detect digital forgery.</p>
            </div>
            
            <GuidelinesBanner />
            
            <SingleUpload onAnalyze={handleSingleAnalyze} loading={loading} />
          </motion.div>
        )}

        {/* State 2: Detailed Analysis View (Verdict + Evidence Tabs) */}
        {activeResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <button onClick={reset} className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition px-4 py-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10 mb-2">
              <ArrowLeft className="w-4 h-4" /> Analyze Another
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