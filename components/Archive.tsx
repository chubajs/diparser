import React from 'react';

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface Transcript {
  utterances: Utterance[];
  audio_duration: number;
}

interface ArchiveItem {
  id: string;
  fileName: string;
  transcriptionDate: string;
  transcript: Transcript;
  cost: string;
}

interface ArchiveProps {
  items: ArchiveItem[];
  onItemSelect: (id: string) => void;
}

const Archive: React.FC<ArchiveProps> = ({ items, onItemSelect }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 px-6 py-4 bg-gray-100">Archive</h2>
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
            <button
              onClick={() => onItemSelect(item.id)}
              className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <p className="font-semibold text-lg text-blue-600">{item.fileName}</p>
              <p className="text-sm text-gray-500 mt-1">{item.transcriptionDate}</p>
              <p className="text-sm text-gray-700 mt-2">Cost: ${item.cost}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Archive;
