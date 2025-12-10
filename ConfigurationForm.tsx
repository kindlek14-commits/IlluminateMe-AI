import React, { useState } from 'react';
import { TwinConfig, MediaType, AspectRatio } from '../types';
import { 
  INDUSTRIES, VISUAL_THEMES, OUTFITS, VEHICLES, PROPS, 
  APPEARANCE_FINISHES, MAKEUP_LOOKS, HAIR_STYLES, NAIL_ART, 
  LIGHTING, LOCATIONS, UGC_TYPES, UGC_HOOKS, VOICE_TONES,
  KID_AGES, KID_OUTFITS
} from '../constants';
import { Icons } from './Icon';
import ImageUploader from './ImageUploader';
import VoiceUploader from './VoiceUploader';

interface Props {
  config: TwinConfig;
  onChange: (newConfig: TwinConfig) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-4 transition-all duration-300 border-b-4 font-bold ${
      active 
        ? 'border-vibrant-cyan text-vibrant-cyan bg-white/5' 
        : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-vibrant-cyan' : ''}`} />
    <span className="text-xs sm:text-sm tracking-wide text-center">{label}</span>
  </button>
);

const SelectGroup = ({ label, value, options, onChange }: any) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-vibrant-cyan mb-1 uppercase tracking-wider">{label}</label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-boss-900 border border-boss-700 text-white rounded-lg px-3 py-3 focus:ring-2 focus:ring-vibrant-pink focus:border-transparent outline-none appearance-none cursor-pointer hover:bg-boss-800 transition-colors shadow-lg"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const ConfigurationForm: React.FC<Props> = ({ config, onChange, onSubmit, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'style' | 'scene' | 'ugc' | 'kids' | 'output'>('style');

  const update = (key: keyof TwinConfig, value: any) => {
    // If we switch to kids tab, we might want to auto-enable isKid, but manual toggle is fine too
    onChange({ ...config, [key]: value });
  };

  const toggleGender = () => {
    update('gender', config.gender === 'Woman' ? 'Man' : 'Woman');
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-32">
      {/* 1. Identity Section */}
      <section className="bg-boss-800/80 backdrop-blur-sm border border-vibrant-cyan/20 rounded-2xl p-6 mb-8 shadow-xl shadow-black/50">
        <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Icons.User className="w-6 h-6 text-vibrant-cyan mr-3" />
            <span className="bg-clip-text text-transparent bg-vibrant-gradient">Twin Identity</span>
          </div>
          
          <div className="flex bg-boss-900 p-1 rounded-lg border border-boss-700">
            <button 
              onClick={() => update('gender', 'Woman')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${config.gender === 'Woman' ? 'bg-vibrant-pink text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Woman
            </button>
            <button 
              onClick={() => update('gender', 'Man')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${config.gender === 'Man' ? 'bg-vibrant-cyan text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Man
            </button>
          </div>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <ImageUploader 
            label="Subject Reference (Face Match)" 
            subLabel="Upload a clear selfie or portrait."
            currentImage={config.subjectImage}
            onImageChange={(val) => update('subjectImage', val)}
          />
          <ImageUploader 
            label="Style Reference (Optional)" 
            subLabel="Outfit, color palette, or vibe reference."
            currentImage={config.styleReferenceImage}
            onImageChange={(val) => update('styleReferenceImage', val)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectGroup 
            label="Industry / Profession"
            value={config.industry}
            options={INDUSTRIES}
            onChange={(v: string) => update('industry', v)}
          />
           <SelectGroup 
            label="Production Design / Theme"
            value={config.productionDesign}
            options={VISUAL_THEMES}
            onChange={(v: string) => update('productionDesign', v)}
          />
        </div>
      </section>

      {/* 2. Customization Tabs */}
      <div className="bg-boss-800/80 backdrop-blur-sm border border-vibrant-cyan/20 rounded-2xl overflow-hidden mb-8 shadow-xl shadow-black/50">
        <div className="flex border-b border-white/10 overflow-x-auto bg-boss-900/50">
          <TabButton 
            active={activeTab === 'style'} 
            onClick={() => setActiveTab('style')} 
            icon={Icons.Palette} 
            label="THE LOOK" 
          />
          <TabButton 
            active={activeTab === 'scene'} 
            onClick={() => setActiveTab('scene')} 
            icon={Icons.MapPin} 
            label="THE SCENE" 
          />
           <TabButton 
            active={activeTab === 'ugc'} 
            onClick={() => setActiveTab('ugc')} 
            icon={Icons.Smartphone} 
            label="UGC STUDIO" 
          />
          <TabButton 
            active={activeTab === 'kids'} 
            onClick={() => setActiveTab('kids')} 
            icon={Icons.Baby} 
            label="KIDS ZONE" 
          />
          <TabButton 
            active={activeTab === 'output'} 
            onClick={() => setActiveTab('output')} 
            icon={Icons.Clapperboard} 
            label="FORMAT" 
          />
        </div>

        <div className="p-8">
          {activeTab === 'style' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              <SelectGroup label="Hair Style" value={config.hairStyle} options={HAIR_STYLES} onChange={(v: string) => update('hairStyle', v)} />
              <SelectGroup label="Makeup Look" value={config.makeupLook} options={MAKEUP_LOOKS} onChange={(v: string) => update('makeupLook', v)} />
              <SelectGroup label="Nail Art" value={config.nailArt} options={NAIL_ART} onChange={(v: string) => update('nailArt', v)} />
              <SelectGroup label="Wardrobe" value={config.outfit} options={OUTFITS} onChange={(v: string) => update('outfit', v)} />
              <SelectGroup label="Appearance / Skin" value={config.appearance} options={APPEARANCE_FINISHES} onChange={(v: string) => update('appearance', v)} />
              <div className="mb-4">
                 <label className="block text-xs font-bold text-vibrant-cyan mb-1 uppercase tracking-wider">Jewelry</label>
                 <input 
                    type="text"
                    className="w-full bg-boss-900 border border-boss-700 text-white rounded-lg px-3 py-3 focus:ring-2 focus:ring-vibrant-pink outline-none shadow-lg"
                    placeholder="e.g. Diamond necklace, Gold watch"
                    value={config.jewelry}
                    onChange={(e) => update('jewelry', e.target.value)}
                 />
              </div>
            </div>
          )}

          {activeTab === 'scene' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <SelectGroup label="Location" value={config.location} options={LOCATIONS} onChange={(v: string) => update('location', v)} />
              <SelectGroup label="Lighting" value={config.lighting} options={LIGHTING} onChange={(v: string) => update('lighting', v)} />
              <SelectGroup label="Vehicle" value={config.vehicle} options={VEHICLES} onChange={(v: string) => update('vehicle', v)} />
              <SelectGroup label="Props" value={config.props} options={PROPS} onChange={(v: string) => update('props', v)} />
            </div>
          )}

          {activeTab === 'ugc' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-vibrant-purple/10 border border-vibrant-purple/30 rounded-lg text-sm text-gray-300">
                <Icons.Sparkles className="inline-block w-4 h-4 mr-2 text-vibrant-purple" />
                Configure your twin for social media dominance.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <SelectGroup label="Content Type" value={config.ugcType} options={UGC_TYPES} onChange={(v: string) => update('ugcType', v)} />
                    <SelectGroup label="Hook Style" value={config.ugcHook} options={UGC_HOOKS} onChange={(v: string) => update('ugcHook', v)} />
                 </div>
                 
                 <div>
                    <VoiceUploader 
                      label="Voice Clone Source" 
                      subLabel="Upload a 30s clear audio sample."
                      currentAudio={config.voiceSample}
                      onAudioChange={(val) => update('voiceSample', val)}
                    />
                    <div className="mt-4">
                        <SelectGroup label="Voice Tone" value={config.voiceTone} options={VOICE_TONES} onChange={(v: string) => update('voiceTone', v)} />
                    </div>
                 </div>

                 <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-vibrant-cyan mb-1 uppercase tracking-wider">Script Idea / Topic</label>
                    <input 
                        type="text"
                        className="w-full bg-boss-900 border border-boss-700 text-white rounded-lg px-3 py-3 focus:ring-2 focus:ring-vibrant-pink outline-none shadow-lg"
                        placeholder="e.g. Top 3 tips for real estate investing in 2025..."
                        value={config.scriptIdea}
                        onChange={(e) => update('scriptIdea', e.target.value)}
                    />
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'kids' && (
             <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between p-4 bg-boss-900 border border-boss-700 rounded-lg">
                  <span className="text-sm font-bold text-white uppercase tracking-wide">Enable Kids Mode</span>
                  <button 
                    onClick={() => update('isKid', !config.isKid)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${config.isKid ? 'bg-vibrant-cyan' : 'bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${config.isKid ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${config.isKid ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                   <SelectGroup label="Child Age Group" value={config.kidAge} options={KID_AGES} onChange={(v: string) => update('kidAge', v)} />
                   <SelectGroup label="Kid's Wardrobe" value={config.outfit} options={KID_OUTFITS} onChange={(v: string) => update('outfit', v)} />
                   <SelectGroup label="Hair Style (Kids)" value={config.hairStyle} options={['Default', 'Pig Tails', 'Bowl Cut', 'Short & Spiky', 'Braids', 'Ponytail']} onChange={(v: string) => update('hairStyle', v)} />
                   <SelectGroup label="Activity / Prop" value={config.props} options={PROPS} onChange={(v: string) => update('props', v)} />
                </div>
             </div>
          )}

          {activeTab === 'output' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-vibrant-cyan mb-3 uppercase tracking-wider">Mode</label>
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => update('mediaType', MediaType.IMAGE)}
                        className={`flex-1 py-4 px-4 rounded-xl border-2 flex items-center justify-center space-x-3 transition-all ${
                          config.mediaType === MediaType.IMAGE ? 'bg-vibrant-cyan/20 border-vibrant-cyan text-vibrant-cyan shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-boss-700 text-gray-400 hover:border-gray-500 hover:bg-white/5'
                        }`}
                      >
                        <Icons.Image className="w-6 h-6" />
                        <span className="font-bold">Image</span>
                      </button>
                      <button 
                        onClick={() => update('mediaType', MediaType.VIDEO)}
                        className={`flex-1 py-4 px-4 rounded-xl border-2 flex items-center justify-center space-x-3 transition-all ${
                          config.mediaType === MediaType.VIDEO ? 'bg-vibrant-pink/20 border-vibrant-pink text-vibrant-pink shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'border-boss-700 text-gray-400 hover:border-gray-500 hover:bg-white/5'
                        }`}
                      >
                        <Icons.Video className="w-6 h-6" />
                        <span className="font-bold">Video (Veo)</span>
                      </button>
                    </div>
                 </div>

                 {config.mediaType === MediaType.IMAGE && (
                   <div className="flex flex-col justify-end">
                      <label className="block text-xs font-bold text-vibrant-cyan mb-3 uppercase tracking-wider">Enhancements</label>
                      <button 
                        onClick={() => update('isUpscale', !config.isUpscale)}
                        className={`w-full py-4 px-4 rounded-xl border-2 flex items-center justify-center space-x-3 transition-all ${
                          config.isUpscale ? 'bg-vibrant-yellow/20 border-vibrant-yellow text-vibrant-yellow' : 'border-boss-700 text-gray-400 hover:border-white/20'
                        }`}
                      >
                         <Icons.Maximize className="w-6 h-6" />
                         <span className="font-bold">Upscale Result (4K)</span>
                         {config.isUpscale && <Icons.Sparkles className="w-4 h-4 animate-pulse" />}
                      </button>
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-bold text-vibrant-cyan mb-3 uppercase tracking-wider">Aspect Ratio</label>
                   <div className="grid grid-cols-3 gap-3">
                     {Object.values(AspectRatio).map((ratio) => (
                       <button
                         key={ratio}
                         onClick={() => update('aspectRatio', ratio)}
                         className={`py-3 px-2 text-sm rounded-lg border-2 font-medium transition-all ${
                           config.aspectRatio === ratio ? 'bg-vibrant-yellow/10 border-vibrant-yellow text-vibrant-yellow' : 'border-boss-700 text-gray-400 hover:border-white/20'
                         }`}
                       >
                         {ratio}
                       </button>
                     ))}
                   </div>
                </div>

                {config.mediaType === MediaType.IMAGE && (
                  <div>
                    <label className="block text-xs font-bold text-vibrant-cyan mb-3 uppercase tracking-wider">Batch Count: {config.batchCount}</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="4" 
                      step="1"
                      value={config.batchCount}
                      onChange={(e) => update('batchCount', parseInt(e.target.value))}
                      className="w-full h-2 bg-boss-700 rounded-lg appearance-none cursor-pointer accent-vibrant-cyan"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                      <span>1</span><span>4</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Vision Prompt */}
      <section className="bg-boss-800/80 backdrop-blur-sm border border-vibrant-cyan/20 rounded-2xl p-6 mb-6 shadow-xl shadow-black/50">
        <label className="block text-sm font-bold text-vibrant-cyan mb-3 flex items-center uppercase tracking-wider">
          <Icons.Wand2 className="w-4 h-4 mr-2" />
          Vision Description
        </label>
        <p className="text-xs text-gray-500 mb-2 font-mono italic opacity-70">
           Note: The system will automatically prepend face-matching instructions for the {config.gender} subject.
        </p>
        <textarea
          value={config.visionDescription}
          onChange={(e) => update('visionDescription', e.target.value)}
          placeholder="Describe the scene, mood, and any specific actions. E.g. 'Walking confidently through a busy Tokyo street at night, neon lights reflecting on the wet pavement, looking at the camera with a smile.'"
          className="w-full h-32 bg-boss-900 border border-boss-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-vibrant-cyan outline-none resize-none placeholder-gray-600 shadow-inner"
        />
      </section>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-boss-900/90 backdrop-blur-xl border-t border-vibrant-cyan/20 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block text-xs font-mono text-gray-400">
             {config.mediaType === MediaType.IMAGE ? `GEMINI 3 PRO ${config.isUpscale ? '+ 4K UPSCALE' : ''}` : 'VEO 3.1'} | Est. Time: {config.mediaType === MediaType.VIDEO ? '2-3 MINS' : '15-30 SEC'}
          </div>
          <button
            onClick={onSubmit}
            disabled={isGenerating}
            className={`
              w-full sm:w-auto px-10 py-4 rounded-xl font-black text-lg flex items-center justify-center space-x-3 transition-all uppercase tracking-wide
              ${isGenerating 
                ? 'bg-boss-700 text-gray-500 cursor-not-allowed' 
                : 'bg-vibrant-gradient text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Icons.Loader2 className="w-6 h-6 animate-spin" />
                <span>Creating Twin...</span>
              </>
            ) : (
              <>
                <Icons.Sparkles className="w-6 h-6 text-white" />
                <span>Generate {config.mediaType === MediaType.IMAGE ? 'Images' : 'Video'}</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ConfigurationForm;