"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Tracks for "சுத்த கண்ணா"
const tracks = [
  { id: 1, title: "1. அன்பு என்னும் ஆகாரம்", duration: "1:24", file: "/audios/suttha-kanna/track1.mp3" },
  { id: 2, title: "2. ஆராதனைக்கு", duration: "10:19", file: "/audios/suttha-kanna/track2.mp3" },
  { id: 3, title: "3. ஆற்றலாலுமல்லு", duration: "5:26", file: "/audios/suttha-kanna/track3.mp3" },
  { id: 4, title: "4. இயேசு செய்த", duration: "3:37", file: "/audios/suttha-kanna/track4.mp3" },
  { id: 5, title: "5. என்னிடம் பாவம்", duration: "1:43", file: "/audios/suttha-kanna/track5.mp3" },
  { id: 6, title: "6. பரலோகத்தை தன்", duration: "0:38", file: "/audios/suttha-kanna/track6.mp3" },
  { id: 7, title: "7. பரலோகத்தில்", duration: "4:25", file: "/audios/suttha-kanna/track7.mp3" },
  { id: 8, title: "8. கண்ணா சுத்த கண்ணா", duration: "7:04", file: "/audios/suttha-kanna/track8.mp3" },
  { id: 9, title: "9. எதிர்காலத்தைப் பற்றிய", duration: "3:16", file: "/audios/suttha-kanna/track9.mp3" },
  { id: 10, title: "10. சபையை கட்டுகிறார்", duration: "4:58", file: "/audios/suttha-kanna/track10.mp3" },
  { id: 11, title: "11. ஒவ்வொரு மனிதனும்", duration: "6:56", file: "/audios/suttha-kanna/track11.mp3" },
  { id: 12, title: "12. பிரார்த்தனை - சாது செல்லப்பா", duration: "3:52", file: "/audios/suttha-kanna/track12.mp3" },
  { id: 13, title: "13. அசத்தோமா", duration: "0:49", file: "/audios/suttha-kanna/track13.mp3" },
  { id: 14, title: "14. லஞ்சம் வாங்கி", duration: "6:33", file: "/audios/suttha-kanna/track14.mp3" },
];

export default function SutthaKannaPage() {
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // When a track is clicked, play it
  const playTrack = (track: typeof tracks[0]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Play audio when current track changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => {
        console.warn("Audio playback failed (likely because audio files are missing):", e);
      });
    }
  }, [currentTrack, isPlaying]);

  // Handle auto play next track when current one ends
  const handleEnded = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < tracks.length - 1) {
      playTrack(tracks[currentIndex + 1]);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 font-sans p-4 py-12">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-xl md:text-3xl font-bold text-center text-[#c2185b] mb-8 md:mb-12">
          சுத்த கண்ணா
        </h1>

        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden mb-8">

          {/* Header of player */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
            <div className="w-12 h-12 bg-slate-500 rounded text-white flex items-center justify-center flex-shrink-0 shadow-inner">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 18V5l12-2v13M9 9l12-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div className="font-medium text-slate-800 truncate text-lg">
              {currentTrack.title.includes('.')
                ? currentTrack.title.substring(currentTrack.title.indexOf('.') + 2)
                : currentTrack.title}
            </div>
          </div>

          {/* Actual Audio Player Controls */}
          <div className="p-4 bg-zinc-800 text-white flex flex-col md:flex-row items-center gap-4">
            <audio
              ref={audioRef}
              src={currentTrack.file}
              controls
              className="w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleEnded}
            />
          </div>

          {/* Track List */}
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {tracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`p-3 flex justify-between items-center cursor-pointer transition-colors
                  ${currentTrack.id === track.id ? 'bg-pink-50 border-l-4 border-[#c2185b]' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <span className={`text-sm md:text-base ${currentTrack.id === track.id ? 'font-bold text-[#c2185b]' : 'text-slate-700'}`}>
                  {track.title}
                </span>
                <span className="text-slate-500 text-sm font-medium">
                  {track.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Album Cover / Poster */}
        <div className="flex flex-col md:flex-row justify-start gap-4">
          <div className="w-full max-w-[300px] aspect-[3/4] bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative flex items-center justify-center">
            <Image src="/images/suttha-kanna-cover-1.jpg" alt="சுத்த கண்ணா Album Cover 1" fill className="object-cover z-10" />
          </div>
          <div className="w-full max-w-[300px] aspect-[3/4] bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative flex items-center justify-center">
            <Image src="/images/suttha-kanna-cover-2.jpg" alt="சுத்த கண்ணா Album Cover 2" fill className="object-cover z-10" />
          </div>
        </div>

      </main>
    </div>
  );
}
