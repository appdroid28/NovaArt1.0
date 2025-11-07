
import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ImageDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ generatedImage, isLoading, error }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg aspect-square">
      {isLoading && (
        <div className="flex flex-col items-center text-gray-400">
          <SpinnerIcon />
          <p className="mt-2 text-lg">Generating your masterpiece...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-red-400 p-4 border border-red-400 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {generatedImage && !isLoading && (
        <img src={generatedImage} alt="Generated Art" className="w-full h-full object-contain rounded-lg" />
      )}

      {!isLoading && !error && !generatedImage && (
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎨</div>
          <p>Your creation will appear here.</p>
        </div>
      )}
    </div>
  );
};
