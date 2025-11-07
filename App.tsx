
import React, { useState, useCallback } from 'react';
import type { UploadedImage } from './types';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ImageDisplay } from './components/ImageDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateOrEditImage } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultImage = await generateOrEditImage(prompt, uploadedImage);
      setGeneratedImage(resultImage);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedImage]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            NovaArt
          </h1>
          <p className="text-gray-400 mt-2">Your AI-powered art studio with Gemini</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6 bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div>
              <label className="text-lg font-semibold text-gray-300 mb-2 block">1. Upload an Image (Optional)</label>
              <ImageUploader onImageUpload={setUploadedImage} />
            </div>
            <div>
              <label htmlFor="prompt-input" className="text-lg font-semibold text-gray-300 mb-2 block">
                2. Describe your vision
              </label>
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                onSubmit={handleGenerate}
                isDisabled={isLoading}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              <SparklesIcon />
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-lg font-semibold text-gray-300 mb-4 self-start">Result</h2>
            <ImageDisplay
              generatedImage={generatedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
