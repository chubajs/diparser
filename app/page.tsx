'use client';

import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import TranscriptionDisplay from '../components/TranscriptionDisplay';
import Archive from '../components/Archive';

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface Transcript {
  utterances: Utterance[];
  audio_duration: number;
  text: string;
}

interface ArchiveItem {
  id: string;
  name: string;
  fileName: string;
  transcriptionDate: string;
  transcript: Transcript;
  cost: string;
  language: string;
  sentences: string[];
  paragraphs: string[];
  subtitles: {
    srt: string;
    vtt: string;
  };
}

export default function Home() {
  const [transcription, setTranscription] = useState<Utterance[]>([]);
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCost, setCurrentCost] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [editingSpeakers, setEditingSpeakers] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<ArchiveItem | null>(null);

  useEffect(() => {
    const storedItems = localStorage.getItem('archiveItems');
    if (storedItems) {
      setArchiveItems(JSON.parse(storedItems));
    }
  }, []);

  const handleFileUpload = async (file: File, language: string) => {
    setIsLoading(true);
    setCurrentCost(null);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data: {
        transcript: Transcript;
        cost: string;
        sentences: string[];
        paragraphs: string[];
        subtitles: { srt: string; vtt: string };
      } = await response.json();

      setTranscription(data.transcript.utterances);
      setCurrentCost(data.cost);

      const transcriptionName = prompt('Enter a name for this transcription:', file.name);
      
      const newItem: ArchiveItem = {
        id: Date.now().toString(),
        name: transcriptionName || file.name,
        fileName: file.name,
        transcriptionDate: new Date().toLocaleString(),
        transcript: data.transcript,
        cost: data.cost,
        language: language,
        sentences: data.sentences,
        paragraphs: data.paragraphs,
        subtitles: data.subtitles,
      };

      setCurrentItem(newItem);

      const updatedItems = [...archiveItems, newItem];
      setArchiveItems(updatedItems);
      localStorage.setItem('archiveItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const handleArchiveItemSelect = (id: string) => {
    const selectedItem = archiveItems.find(item => item.id === id);
    if (selectedItem) {
      setTranscription(selectedItem.transcript.utterances);
      setCurrentCost(selectedItem.cost);
    }
  };

  const handleArchiveItemNameChange = (id: string, newName: string) => {
    const updatedItems = archiveItems.map(item =>
      item.id === id ? { ...item, name: newName } : item
    );
    setArchiveItems(updatedItems);
    localStorage.setItem('archiveItems', JSON.stringify(updatedItems));
  };

  const handleEditSpeakers = (id: string) => {
    setEditingSpeakers(id);
    const item = archiveItems.find(item => item.id === id);
    if (item) {
      setTranscription(item.transcript.utterances);
    }
  };

  const handleSaveSpeakers = (updatedUtterances: Utterance[]) => {
    if (editingSpeakers) {
      const updatedItems = archiveItems.map(item =>
        item.id === editingSpeakers
          ? { ...item, transcript: { ...item.transcript, utterances: updatedUtterances } }
          : item
      );
      setArchiveItems(updatedItems);
      localStorage.setItem('archiveItems', JSON.stringify(updatedItems));
      setEditingSpeakers(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Audio Transcription App</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} progress={progress} />
            {isLoading && (
              <div className="mt-4">
                <p className="text-lg text-center text-gray-700 mb-2">Transcribing... Please wait.</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
            {currentCost && (
              <p className="text-lg text-center text-gray-700 mt-4">Transcription Cost: ${currentCost}</p>
            )}
          </div>
        </div>
        <TranscriptionDisplay
          transcription={transcription}
          isEditing={!!editingSpeakers}
          onSave={handleSaveSpeakers}
          sentences={currentItem?.sentences}
          paragraphs={currentItem?.paragraphs}
          subtitles={currentItem?.subtitles}
        />
        <Archive
          items={archiveItems}
          onItemSelect={handleArchiveItemSelect}
          onItemNameChange={handleArchiveItemNameChange}
          onEditSpeakers={handleEditSpeakers}
        />
      </div>
    </main>
  );
}
