import React, { useRef } from 'react';
import { Icons } from './Icon';

interface ImageUploaderProps {
  label: string;
  subLabel?: string;
  onImageChange: (base64: string | null) => void;
  currentImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, subLabel, onImageChange, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2 group">
      <label className="block text-sm font-bold text-gray-300 uppercase tracking-wide group-hover:text-vibrant-cyan transition-colors">{label}</label>
      {subLabel && <p className="text-xs text-gray-500 mb-2 font-mono">{subLabel}</p>}
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl h-56 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
          ${currentImage 
            ? 'border-vibrant-cyan/50 bg-boss-900 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
            : 'border-boss-700 hover:border-vibrant-pink hover:bg-white/5 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]'
          }
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {currentImage ? (
          <div className="relative w-full h-full p-2 group-image">
             <img 
               src={currentImage} 
               alt="Uploaded" 
               className="w-full h-full object-cover rounded-lg shadow-inner"
             />
             <div className="absolute inset-0 bg-boss-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-sm">
                <button 
                  onClick={clearImage}
                  className="bg-vibrant-pink p-3 rounded-full text-white hover:bg-red-600 transition-all shadow-lg transform hover:scale-110"
                >
                  <Icons.RefreshCw className="w-6 h-6" />
                </button>
             </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <div className="bg-boss-700 p-4 rounded-full inline-block mb-4 group-hover:bg-boss-800 transition-colors">
              <Icons.Upload className="w-8 h-8 text-gray-400 group-hover:text-vibrant-pink transition-colors" />
            </div>
            <p className="text-sm font-bold text-gray-300 group-hover:text-white">CLICK TO UPLOAD</p>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-mono">JPG, PNG supported</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;