import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  isLoading: boolean;
  progress: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, progress }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isLoading) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, isLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.ogg', '.m4a']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <div className="w-full max-w-md mx-auto mt-8">
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
