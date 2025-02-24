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
  sentences?: string[];
  paragraphs?: string[];
  subtitles?: {
    srt: string;
    vtt: string;
  };
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  isEditing,
  onSave,
  sentences,
  paragraphs,
  subtitles,
}) => {
  const [editedTranscription, setEditedTranscription] = useState<Utterance[]>(transcription);
  const [activeTab, setActiveTab] = useState<'utterances' | 'sentences' | 'paragraphs'>('utterances');

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

  const handleDownloadSubtitles = (format: 'srt' | 'vtt') => {
    if (subtitles) {
      const blob = new Blob([subtitles[format]], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subtitles.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
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
      <div className="px-6 py-4">
        <div className="flex mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded ${activeTab === 'utterances' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('utterances')}
          >
            Utterances
          </button>
          <button
            className={`mr-2 px-4 py-2 rounded ${activeTab === 'sentences' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('sentences')}
          >
            Sentences
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'paragraphs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('paragraphs')}
          >
            Paragraphs
          </button>
        </div>
        {subtitles && (
          <div className="mb-4">
            <button
              className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleDownloadSubtitles('srt')}
            >
              Download SRT
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleDownloadSubtitles('vtt')}
            >
              Download VTT
            </button>
          </div>
        )}
      </div>
      <div className="divide-y divide-gray-200">
        {activeTab === 'utterances' && editedTranscription.map((utterance, index) => (
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
        {activeTab === 'sentences' && sentences && sentences.map((sentence, index) => (
          <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <p className="text-gray-700">{sentence}</p>
          </div>
        ))}
        {activeTab === 'paragraphs' && paragraphs && paragraphs.map((paragraph, index) => (
          <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <p className="text-gray-700">{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
