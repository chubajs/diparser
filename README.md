ch# Dialogue Transcriber

This is a Next.js application that transcribes audio files using AssemblyAI and displays the transcription with speaker labels.

## Features

- Upload audio files (MP3, OGG, M4A)
- Transcribe audio using AssemblyAI with real-time progress updates
- Support for multiple languages (English, Spanish, French, German, Italian, Portuguese, Dutch, Japanese, Chinese, Russian)
- Automatic selection of the best transcription model based on the chosen language
- Display transcriptions with speaker labels and timestamps in a user-friendly format
- View transcriptions as utterances, sentences, or paragraphs
- Download subtitles in SRT and VTT formats
- Archive previous transcriptions with custom names for easy access
- Edit transcription names directly from the archive page
- Edit speaker names for all utterances by the same speaker simultaneously
- Show transcription cost for each processed file
- Persistent storage of transcriptions between sessions
- Responsive and visually appealing user interface

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- AssemblyAI API key

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dialogue-transcriber.git
   cd dialogue-transcriber
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your AssemblyAI API key:
   ```
   ASSEMBLYAI_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with your actual AssemblyAI API key.

   Note: The `.env.local` file is included in `.gitignore` to prevent exposing your API key. Make sure to keep your API key secret and not share it publicly.

## Project Structure

The main files and directories in this project are:

- `app/`: Contains the main application files
  - `layout.tsx`: Root layout component with HTML structure
  - `page.tsx`: Main page component with application logic
  - `globals.css`: Global styles
  - `api/transcribe/route.ts`: API route for transcription with detailed logging
- `components/`: React components used in the application
  - `FileUpload.tsx`: File upload component with progress bar
  - `TranscriptionDisplay.tsx`: Enhanced transcription display component
  - `Archive.tsx`: Improved archive component for past transcriptions
- `public/`: Static assets
- `README.md`: This file
- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `postcss.config.mjs`: PostCSS configuration

## Running the application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select the language of the audio file from the dropdown menu.
2. Drag and drop an audio file or click to select a file for upload.
3. Watch the progress bar as the file is transcribed.
4. Enter a custom name for the transcription when prompted.
5. View the transcription with speaker labels and timestamps in a clean, easy-to-read format.
6. Toggle between utterances, sentences, and paragraphs views using the tabs above the transcription.
7. Download subtitles in SRT or VTT format using the provided buttons.
8. See the transcription cost for the processed file.
9. Access previous transcriptions from the archive by clicking on the transcription name.
10. Edit transcription names by clicking the "Edit Name" button next to each archive item.
11. Edit speaker names by clicking the "Edit Speakers" button next to each archive item.
    - In edit mode, you can change the speaker names for all utterances by the same speaker simultaneously.
    - The number of utterances for each speaker is displayed next to their name.
    - Click "Save Speaker Names" to save your changes.
12. Transcriptions are automatically saved and will persist between browser sessions.

## Supported Languages

The application supports the following languages:
- English (uses the 'best' transcription model)
- Spanish
- French
- German
- Italian
- Portuguese
- Dutch
- Japanese
- Chinese
- Russian

For languages other than English, the application uses the 'nano' transcription model.

## Troubleshooting

If you encounter any issues:
1. Ensure all dependencies are installed correctly by running `npm install`.
2. Check that the AssemblyAI API key is set correctly in the `.env.local` file. Make sure you've replaced the placeholder with your actual API key.
3. Verify that the project structure matches the one described above.
4. If you encounter build errors, try running `npm run build` to see more detailed error messages.
5. Make sure your Node.js version is compatible with the project (v14 or later).
6. If you're getting API-related errors, double-check your AssemblyAI API key and ensure you have an active account with sufficient credits.
7. Check the console in your browser's developer tools for any error messages or warnings.

## License

This project is open source and available under the [MIT License](LICENSE).
