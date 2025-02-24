import React, { useState } from 'react';

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
  name: string;
  fileName: string;
  transcriptionDate: string;
  transcript: Transcript;
  cost: string;
}

interface ArchiveProps {
  items: ArchiveItem[];
  onItemSelect: (id: string) => void;
  onItemNameChange: (id: string, newName: string) => void;
}

const Archive: React.FC<ArchiveProps> = ({ items, onItemSelect, onItemNameChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  if (items.length === 0) {
    return null;
  }

  const handleEditClick = (item: ArchiveItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleSaveClick = (id: string) => {
    onItemNameChange(id, editingName);
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 px-6 py-4 bg-gray-100">Archive</h2>
      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
            <div className="p-6">
              {editingId === item.id ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-grow mr-2 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleSaveClick(item.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onItemSelect(item.id)}
                    className="flex-grow text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <p className="font-semibold text-lg text-blue-600">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-1">File: {item.fileName}</p>
                    <p className="text-sm text-gray-500 mt-1">Date: {item.transcriptionDate}</p>
                    <p className="text-sm text-gray-700 mt-2">Cost: ${item.cost}</p>
                  </button>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Archive;
