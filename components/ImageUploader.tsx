
import React, { useState, useCallback, useRef } from 'react';
import type { UploadedImage } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage | null) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the `data:mimeType;base64,` prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        setFileName(file.name);
        onImageUpload({
          file: file,
          base64: base64,
          mimeType: file.type,
        });
      } catch (error) {
        console.error("Error converting file to base64", error);
        alert("Failed to read the image file.");
      }
    }
  }, [onImageUpload]);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    setFileName(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-purple-500');
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const syntheticEvent = {
        target: { files: event.dataTransfer.files }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  }, [handleFileChange]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('border-purple-500');
  };
    
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-purple-500');
  };


  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="image-upload"
      />
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="cursor-pointer border-2 border-dashed border-gray-500 hover:border-purple-400 p-8 rounded-lg text-center transition-colors duration-300"
        >
          <div className="flex flex-col items-center text-gray-400">
            <UploadIcon />
            <p className="mt-2">Drag & drop an image here</p>
            <p className="text-sm text-gray-500">or click to select</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full h-auto rounded-lg" />
          <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-50 p-2 rounded-lg">
            <p className="text-white text-sm mr-2 truncate max-w-[150px]">{fileName}</p>
            <button
              onClick={handleRemoveImage}
              className="bg-red-500 hover:bg-red-600 text-white font-bold p-1 rounded-full text-xs transition-colors"
              aria-label="Remove image"
            >
              &#x2715;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
