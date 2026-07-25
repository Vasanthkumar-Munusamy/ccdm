"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Defining the tracks based on the provided screenshot
const tracks = [
  { id: 1, title: "1. அகத்தியனின் உரை", duration: "4:12", file: "/audios/nilaiyana-singasanam/track1.mp3" },
  { id: 2, title: "2. அற்புதங்கள் செய்கின்ற", duration: "5:07", file: "/audios/nilaiyana-singasanam/track2.mp3" },
  { id: 3, title: "3. அன்பை சொல்ல வந்தோம்", duration: "7:10", file: "/audios/nilaiyana-singasanam/track3.mp3" },
  { id: 4, title: "4. ஒருவன் இயேசுவில் அன்பாய் இருந்தால்", duration: "7:19", file: "/audios/nilaiyana-singasanam/track4.mp3" },
  { id: 5, title: "5. கிறிஸ்தவரே நாம் ஒன்றுபட்டால்", duration: "5:24", file: "/audios/nilaiyana-singasanam/track5.mp3" },
  { id: 6, title: "6. நாங்க உங்களைதான் நம்பி", duration: "6:15", file: "/audios/nilaiyana-singasanam/track6.mp3" },
  { id: 7, title: "7. நான் என்ன செய்ய வேண்டுமென்று", duration: "5:43", file: "/audios/nilaiyana-singasanam/track7.mp3" },
  { id: 8, title: "8. நிலையான சிங்காசனம்", duration: "5:17", file: "/audios/nilaiyana-singasanam/track8.mp3" },
  { id: 9, title: "9. ஜாதி பார்க்கும் கிறிஸ்தவனே", duration: "8:22", file: "/audios/nilaiyana-singasanam/track9.mp3" },
  { id: 10, title: "10. அகத்தியனின் முடிவுரை", duration: "1:47", file: "/audios/nilaiyana-singasanam/track10.mp3" },
];

export default function NilaiyanaSingasanamPage() {
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
          நிலையான சிங்காசனம்
        </h1>
        
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden mb-8">
          
          {/* Header of player */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
            <div className="w-12 h-12 bg-slate-500 rounded text-white flex items-center justify-center flex-shrink-0 shadow-inner">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 18V5l12-2v13M9 9l12-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div className="font-medium text-slate-800 truncate text-lg">
              {currentTrack.title.substring(currentTrack.title.indexOf('.') + 2)}
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
        <div className="flex justify-start">
          <div className="w-full max-w-[350px] aspect-square bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative flex items-center justify-center">
             <Image src="/images/nilaiyana-singasanam-cover.jpg" alt="நிலையான சிங்காசனம் Album Cover" fill className="object-cover" />
          </div>
        </div>

      </main>
    </div>
  );
}
