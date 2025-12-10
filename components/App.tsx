import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ConfigurationForm from './components/ConfigurationForm';
import ResultGallery from './components/ResultGallery';
import { TwinConfig, MediaType, AspectRatio, GeneratedResult } from './types';
import { generateMedia, checkAndSelectKey } from './services/geminiService';

const DEFAULT_CONFIG: TwinConfig = {
  mediaType: MediaType.IMAGE,
  visionDescription: '',
  industry: 'Influencer',
  batchCount: 2,
  aspectRatio: AspectRatio.PORTRAIT,
  
  // Identity defaults
  gender: 'Woman',
  isUpscale: false,
  isKid: false,
  kidAge: 'Child (6-10)',

  subjectImage: null,
  styleReferenceImage: null,
  outfit: 'Default',
  hairStyle: 'Default',
  makeupLook: 'Default',
  appearance: 'Default',
  nailArt: 'Default',
  jewelry: '',
  location: 'Default',
  lighting: 'Default',
  vehicle: 'None',
  props: 'None',
  productionDesign: 'Default',
  ugcType: 'None',
  ugcHook: 'None',
  voiceTone: 'Professional',
  voiceSample: null,
  scriptIdea: ''
};

function App() {
  const [config, setConfig] = useState<TwinConfig>(DEFAULT_CONFIG);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [view, setView] = useState<'form' | 'results'>('form');

  // Check for API key on mount, though specifically needed before generation usually
  useEffect(() => {
    // Optional: Pre-check if needed, but we do it on generate mostly.
  }, []);

  const handleGenerate = async () => {
    if (!config.visionDescription && !config.subjectImage) {
      alert("Please provide at least a subject image or a vision description.");
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Ensure API Key selected
      await checkAndSelectKey();

      // 2. Generate
      const generatedResults = await generateMedia(config);
      
      if (generatedResults.length > 0) {
        setResults(generatedResults);
        setView('results');
      } else {
        alert("Generation produced no results. Please try again with a different prompt.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during generation. Please check your API key selection or try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setView('form');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-boss-gradient text-white font-sans selection:bg-vibrant-pink selection:text-white">
      <Header onReset={handleReset} />
      
      <main className="pt-24 pb-12">
        {view === 'form' ? (
          <div className="px-6">
            <div className="max-w-5xl mx-auto mb-10 text-center pt-4">
              <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-vibrant-gradient mb-6 tracking-tight drop-shadow-lg">
                DESIGN YOUR TWIN
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                Create a hyper-realistic AI twin tailored for <span className="text-vibrant-cyan font-bold">social dominance</span> and <span className="text-vibrant-pink font-bold">professional impact</span>.
              </p>
            </div>
            
            <ConfigurationForm 
              config={config} 
              onChange={setConfig} 
              onSubmit={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        ) : (
          <ResultGallery 
            results={results} 
            onBack={handleReset} 
          />
        )}
      </main>
    </div>
  );
}

export default App;