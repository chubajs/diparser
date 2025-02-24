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

const languageToModel: { [key: string]: string } = {
  en: 'en_us',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
  nl: 'nl',
  ja: 'ja',
  zh: 'zh',
  ru: 'ru',
};

export async function POST(request: Request) {
  console.log('Transcription request received');
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const language = formData.get('language') as string;

  if (!file) {
    console.log('No file uploaded');
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (!language || !languageToModel[language]) {
    console.log('Invalid language');
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
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
      language_code: languageToModel[language],
      speaker_labels: true,
      speech_model: language === 'en' ? 'best' : 'nano' as 'best' | 'nano',
    };

    const transcript = await client.transcripts.submit(params);
    console.log('Transcription submitted, ID:', transcript.id);

    console.log('Waiting for transcription to complete');
    const polledTranscript = await client.transcripts.waitUntilReady(transcript.id, {
      pollingInterval: 3000,
    });

    console.log('Transcription completed');

    // Calculate the cost of transcription (assuming $0.00025 per second)
    const durationInSeconds = polledTranscript.audio_duration || 0;
    const cost = (durationInSeconds * 0.00025).toFixed(2);

    console.log('Transcription cost:', cost);

    // Get sentences and paragraphs
    const sentences = await client.transcripts.sentences(transcript.id);
    const paragraphs = await client.transcripts.paragraphs(transcript.id);

    // Get subtitles
    const srt = await client.transcripts.subtitles(transcript.id, "srt");
    const vtt = await client.transcripts.subtitles(transcript.id, "vtt");

    return NextResponse.json({
      transcript: polledTranscript,
      cost,
      sentences,
      paragraphs,
      subtitles: { srt, vtt }
    });
  } catch (error) {
    console.error('Transcription error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `Transcription error: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 });
    }
  }
}
