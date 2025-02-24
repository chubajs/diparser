import React, { useState, useEffect } from 'react';

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface TranscriptionDisplayProps {
  transcription: Utterance[];
  isEditing: boolean;
  onSave: (updatedUtterances: Utterance[]) => void;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription, isEditing, onSave }) => {
  const [editedTranscription, setEditedTranscription] = useState<Utterance[]>(transcription);

  useEffect(() => {
    setEditedTranscription(transcription);
  }, [transcription]);

  const handleSpeakerChange = (index: number, newSpeaker: string) => {
    const updatedTranscription = editedTranscription.map((utterance, i) => {
      if (utterance.speaker === editedTranscription[index].speaker) {
        return { ...utterance, speaker: newSpeaker };
      }
      return utterance;
    });
    setEditedTranscription(updatedTranscription);
  };

  const handleSave = () => {
    onSave(editedTranscription);
  };

  if (transcription.length === 0) {
    return null;
  }

  const uniqueSpeakers = Array.from(new Set(editedTranscription.map(u => u.speaker)));

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 px-6 py-4 bg-gray-100">Transcription</h2>
      {isEditing && (
        <div className="px-6 py-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Edit Speaker Names</h3>
          {uniqueSpeakers.map((speaker, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={speaker}
                onChange={(e) => handleSpeakerChange(editedTranscription.findIndex(u => u.speaker === speaker), e.target.value)}
                className="font-semibold text-blue-600 border-b border-blue-500 focus:outline-none mr-2"
              />
              <span className="text-sm text-gray-500">
                ({editedTranscription.filter(u => u.speaker === speaker).length} utterances)
              </span>
            </div>
          ))}
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Speaker Names
          </button>
        </div>
      )}
      <div className="divide-y divide-gray-200">
        {editedTranscription.map((utterance, index) => (
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
