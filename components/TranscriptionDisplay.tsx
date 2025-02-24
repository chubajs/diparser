import React from 'react';

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface TranscriptionDisplayProps {
  transcription: Utterance[];
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription }) => {
  if (transcription.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 px-6 py-4 bg-gray-100">Transcription</h2>
      <div className="divide-y divide-gray-200">
        {transcription.map((utterance, index) => (
          <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center mb-2">
              <span className="font-semibold text-lg text-blue-600">{utterance.speaker}</span>
              <span className="ml-4 text-sm text-gray-500">
                {new Date(utterance.start * 1000).toISOString().substr(11, 8)} - 
                {new Date(utterance.end * 1000).toISOString().substr(11, 8)}
              </span>
            </div>
            <p className="text-gray-700">{utterance.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
