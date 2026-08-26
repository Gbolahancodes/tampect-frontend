import { useState, useEffect } from 'react';
import { Shield, Info, X, FileCheck, ScanSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './GlassCard';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          isScrolled ? "bg-black/40 backdrop-blur-2xl" : "bg-transparent"
        )}
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.02 }}>
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-xl font-bold tracking-tight text-white">Tampect</h1>
            </motion.div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>System Specs</span>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isModalOpen && (
          /* Fixed wrapper that absolutely centers everything via flexbox */
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            
            {/* Dark background overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* The Modal itself */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-full flex flex-col bg-[#050505] border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                <h2 className="text-lg font-bold text-white tracking-tight">System Capabilities</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Scrollable Body - This will now properly scroll if the text is too long! */}
              <div className="p-6 space-y-8 overflow-y-auto min-h-0">
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold text-white mb-3 uppercase tracking-widest">
                    <ScanSearch className="w-4 h-4 text-white/50" />
                    How It Works
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed font-medium">
                    This forensic engine analyzes pixel-level physics to detect digital manipulation. It cross-references Error Level Analysis (ELA), Laplacian grain variation, and EXIF metadata anomalies to expose Photoshop edits, deepfakes, or digital splicing.
                  </p>
                </div>
                
                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold text-white mb-3 uppercase tracking-widest">
                    <FileCheck className="w-4 h-4 text-white/50" />
                    Supported Documents
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/60 font-medium">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white/50 rounded-full"/> Identity Cards</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white/50 rounded-full"/> Passports & Visas</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white/50 rounded-full"/> Financial Invoices</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white/50 rounded-full"/> Certificates</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white/50 rounded-full"/> Legal Contracts</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-white/50 rounded-full"/> Official Letters</li>
                  </ul>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-5 bg-white/[0.02] border-t border-white/10 shrink-0">
                <p className="text-xs text-center font-semibold text-white/30 uppercase tracking-widest">
                  Powered by AI & Optical Physics
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}