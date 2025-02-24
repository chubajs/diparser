import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Dialogue Transcriber',
  description: 'Transcribe audio files with speaker labels',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
