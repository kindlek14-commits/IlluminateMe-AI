import React, { useRef } from 'react';
import { Icons } from './Icon';

interface VoiceUploaderProps {
  label: string;
  subLabel?: string;
  onAudioChange: (base64: string | null) => void;
  currentAudio: string | null;
}

const VoiceUploader: React.FC<VoiceUploaderProps> = ({ label, subLabel, onAudioChange, currentAudio }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAudioChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAudioChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2 group">
      <label className="block text-sm font-bold text-gray-300 uppercase tracking-wide group-hover:text-vibrant-cyan transition-colors">{label}</label>
      {subLabel && <p className="text-xs text-gray-500 mb-2 font-mono">{subLabel}</p>}
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
          ${currentAudio 
            ? 'border-vibrant-pink/50 bg-boss-900 shadow-[0_0_20px_rgba(244,63,94,0.1)]' 
            : 'border-boss-700 hover:border-vibrant-cyan hover:bg-white/5 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'
          }
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="audio/*" 
          className="hidden" 
        />
        
        {currentAudio ? (
          <div className="flex flex-col items-center justify-center p-4">
             <div className="bg-vibrant-pink/20 p-3 rounded-full mb-2 animate-pulse">
                <Icons.Music className="w-6 h-6 text-vibrant-pink" />
             </div>
             <p className="text-xs text-white font-bold uppercase tracking-wide">Voice Sample Loaded</p>
             <button 
               onClick={clearAudio}
               className="mt-2 text-[10px] text-gray-400 hover:text-white underline"
             >
               Remove
             </button>
          </div>
        ) : (
          <div className="text-center p-4">
            <div className="bg-boss-700 p-3 rounded-full inline-block mb-2 group-hover:bg-boss-800 transition-colors">
              <Icons.Mic className="w-6 h-6 text-gray-400 group-hover:text-vibrant-cyan transition-colors" />
            </div>
            <p className="text-xs font-bold text-gray-300 group-hover:text-white">UPLOAD AUDIO</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-mono">MP3, WAV</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceUploader;