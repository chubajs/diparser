import { NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai';

const apiKey = process.env.ASSEMBLYAI_API_KEY;

if (!apiKey) {
  throw new Error('ASSEMBLYAI_API_KEY is not set in the environment variables');
}

const client = new AssemblyAI({
  apiKey: apiKey,
});

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface TranscriptResult {
  id: string;
  status: string;
  text: string;
  utterances: Utterance[];
  audio_duration: number;
}

export async function POST(request: Request) {
  console.log('Transcription request received');
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    console.log('No file uploaded');
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    console.log('Processing file:', file.name);
    const buffer = await file.arrayBuffer();
    const audioData = Buffer.from(buffer);

    console.log('Uploading file');
    const uploadResponse = await client.files.upload(audioData);

    console.log('Starting transcription');
    const params = {
      audio_url: uploadResponse,
      speaker_labels: true,
    };

    const transcript = await client.transcripts.create(params);
    console.log('Transcription initiated, polling for results');

    let polledTranscript: TranscriptResult | null = null;
    while (true) {
      const result = await client.transcripts.get(transcript.id);
      if (result.status === 'completed' || result.status === 'error') {
        polledTranscript = {
          id: result.id,
          status: result.status,
          text: result.text || '',
          utterances: result.utterances || [],
          audio_duration: result.audio_duration || 0,
        };
        break;
      }
      console.log(`Transcription status: ${result.status}`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Increased polling interval
    }

    if (!polledTranscript || polledTranscript.status === 'error') {
      throw new Error('Transcription failed');
    }

    console.log('Transcription completed');

    // Calculate the cost of transcription (assuming $0.00025 per second)
    const durationInSeconds = polledTranscript.audio_duration;
    const cost = (durationInSeconds * 0.00025).toFixed(2);

    console.log('Transcription cost:', cost);

    return NextResponse.json({ transcript: polledTranscript, cost });
  } catch (error) {
    console.error('Transcription error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Transcription error: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
