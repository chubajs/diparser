import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File, language: string) => Promise<void>;
  isLoading: boolean;
  progress: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, progress }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isLoading) {
      onFileUpload(acceptedFiles[0], selectedLanguage);
    }
  }, [onFileUpload, isLoading, selectedLanguage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.ogg', '.m4a']
    },
    multiple: false,
    disabled: isLoading
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ru', name: 'Russian' },
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700">
          Select Language
        </label>
        <select
          id="language-select"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div>
            <p>Uploading and transcribing...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the audio file here...</p>
        ) : (
          <p>Drag and drop an audio file here, or click to select a file</p>
        )}
        <p className="text-sm text-gray-500 mt-2">Supported formats: MP3, OGG, M4A</p>
      </div>
    </div>
  );
};

export default FileUpload;
