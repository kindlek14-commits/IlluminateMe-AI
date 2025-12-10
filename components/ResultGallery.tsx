import React from 'react';
import { GeneratedResult, MediaType } from '../types';
import { Icons } from './Icon';

interface Props {
  results: GeneratedResult[];
  onBack: () => void;
}

const ResultGallery: React.FC<Props> = ({ results, onBack }) => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="text-4xl font-display font-black text-white uppercase tracking-wider">
          Your <span className="text-vibrant-cyan">Twin</span> Results
        </h2>
        <button 
          onClick={onBack}
          className="px-8 py-3 border-2 border-vibrant-pink rounded-xl text-white font-bold hover:bg-vibrant-pink hover:shadow-lg hover:shadow-vibrant-pink/40 transition-all uppercase tracking-wide flex items-center"
        >
          <Icons.RefreshCw className="w-4 h-4 mr-2" />
          Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {results.map((res, idx) => (
          <div key={idx} className="bg-boss-800 rounded-2xl overflow-hidden border border-vibrant-cyan/20 shadow-2xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300">
            {res.type === MediaType.VIDEO ? (
              <video 
                src={res.url} 
                controls 
                autoPlay 
                loop 
                className="w-full aspect-video object-cover"
              />
            ) : (
              <img 
                src={res.url} 
                alt={`Generated twin ${idx}`} 
                className="w-full h-auto object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 bg-vibrant-purple/20 text-vibrant-purple text-xs font-bold rounded-lg border border-vibrant-purple/30 uppercase tracking-widest">
                  {res.type}
                </span>
                <a 
                  href={res.url} 
                  download={`luxe-twin-${idx}.${res.type === MediaType.VIDEO ? 'mp4' : 'png'}`}
                  className="p-2 text-gray-400 hover:text-vibrant-cyan transition-colors"
                  title="Download"
                >
                  <Icons.Download className="w-6 h-6" />
                </a>
              </div>
              <p className="text-sm text-gray-400 font-mono leading-relaxed line-clamp-3">
                > {res.prompt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultGallery;