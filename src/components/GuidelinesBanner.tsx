import { Camera, MonitorOff, Focus } from 'lucide-react';

export function GuidelinesBanner() {
  return (
    <div className="mb-10 w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:divide-x divide-white/10 border-y border-white/10 py-6">
        
        <div className="flex-1 flex items-start gap-4 px-2 md:px-6 py-4 md:py-0">
          <Camera className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white/90 tracking-tight">Camera Photos Only</p>
            <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
              Upload original, unedited physical document captures.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-start gap-4 px-2 md:px-6 py-4 md:py-0">
          <MonitorOff className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white/90 tracking-tight">No Screenshots</p>
            <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
              Screenshots discard EXIF data & optical signatures.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-start gap-4 px-2 md:px-6 py-4 md:py-0">
          <Focus className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white/90 tracking-tight">Ensure Focus</p>
            <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
              Avoid severe blur, glare, and partial cutoffs.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}