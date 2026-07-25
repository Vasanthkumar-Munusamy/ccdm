"use client";

import { useState } from "react";
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";

// Placeholder videos for the gallery
const videos = [
  { id: "BQQwamC8iOw", title: "ஒரு சாமியாரின் சான்று" },
  { id: "h2zSvY5vWKY", title: "சாதிமறுப்பு புரிதலில் வளர்ச்சி" },
  { id: "_VC430cIouw", title: "கடவுள் மனிதனை சாதி அடிப்படையில் படைத்தாரா?" },
  { id: "G5cppfXKn2Y", title: "மனிதன் உண்மையான கடவுளை ஏன் வணங்கவேண்டும்?" },
  { id: "PHF02cj_EVI", title: "ஆபிரகாம் நிஜமாகவே சாதி பார்த்தாரா?" },
  { id: "74DEOusajTw", title: "சகோ. அகத்தியனைப் பற்றி நற்செய்தி அறிவிப்பாளர் Jony Dany at Padi, Chennai." },
  { id: "8DxfO2OnG48", title: "ஒரு அவசரச் செய்தி" },
  { id: "lh1L6u3BeZo", title: "கிறிஸ்தவ சாதி மறுப்பாளர் இயக்கத்தில் இணைய அழைப்பு." },
  { id: "PEAdkulxaXU", title: "கிறிஸ்தவ சாதியம்: தோழர் திருமாவளவன்" },
  { id: "3wFycFqulks", title: "INTRODUCING CCDM" },
  { id: "4UqSJB3u60k", title: "சிறப்பு நேர்காணல் | சகோ. அகத்தியன் |" },
  { id: "tMOEOiddq1c", title: "Bro.Agathiyan - Why God should be praised and what brings glory to God? ( SIRIPOM SINTHIPOM )" },
  { id: "ivUjNtXt_bM", title: "MY JESUS TV's Uzhiyapathaiyil with Bro.AGATHIYAN | Part 1" },
  { id: "l81oVPJ1VGw", title: "MY JESUS TV's Uzhiyapathaiyil with Bro.AGATHIYAN | Part 2" },
  { id: "UqVjZqnOBY4", title: "SIRIPOM SINTHIPOM VOLUME 2 Part(1/2) by Bro.AGATHIYAN" },
  { id: "dwdRO3d_BtI", title: "SIRIPOM SINTHIPOM VOLUME 2 (Part-2/2) by Bro.AGATHIYAN" },
  { id: "cdhesb83Jh8", title: "SIRIPOM SINTHIPOM VOLUME 3 (Part-1/2 & Part-2/2) by Bro.AGATHIYAN" },
  { id: "rjUqPIYPbm0", title: "SIRIPOM SINTHIPOM" },
  { id: "Nys_0QeiaUk", title: "பகுதி 1 - சகோ அகத்தியன் நியாயமான ஆதங்கம் || சிறப்பு நேர்காணல்" },
  { id: "Q325KKj2kUY", title: "15 ஆண்டுகளுக்கு முன் பேசிய வீடியோ வைரல் : பலரை கவர்ந்துள்ள பாஸ்டர் அகத்தியன் பேச்சு" },
  { id: "DXUv_Vk8GwE", title: "|வணக்கம் தமிழன்| அகத்தியன் சாதி ஒழிப்பு" },
  { id: "gmgY3dxdjkc", title: "கிறிஸ்தவத்தில் இருக்கும் நாற்றம் பிடித்த சாதியத்தை ஒழிக்க வேண்டும் - Pastor Agathiyan Interview" },
];

export default function VideosPage() {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedVideoIndex !== null) {
      setSelectedVideoIndex((selectedVideoIndex + 1) % videos.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedVideoIndex !== null) {
      setSelectedVideoIndex((selectedVideoIndex - 1 + videos.length) % videos.length);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 font-sans p-4 py-12">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-3xl font-bold text-center text-[#c2185b] mb-4">
          Videos Gallery
        </h1>
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
          Explore our collection of videos. Click on any video to watch it.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="group bg-white rounded-2xl shadow-md border-t-4 border-[#c2185b] cursor-pointer p-2 transition-shadow hover:shadow-lg flex flex-col relative"
              onClick={() => setSelectedVideoIndex(index)}
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                {/* <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/10 rounded-xl p-3 backdrop-blur-sm group-hover:bg-[#c2185b]/80 transition-colors">
                    <Play className="text-white w-8 h-8 fill-current" />
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center space-x-4 mt-12">
          {/* <button className="bg-[#424242] hover:bg-gray-800 text-white px-6 py-2 rounded shadow transition-colors font-medium">
            Load More...
          </button> */}
          <a
            href="https://www.youtube.com/channel/UCNZ44bexy1ecCj5uTOus_NQ"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-200 hover:bg-gray-50 text-red-600 px-6 py-2 rounded shadow transition-colors flex items-center space-x-2 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>View our CCDM channel</span>
          </a>
        </div>

        {/* Fullscreen Video Modal */}
        {selectedVideoIndex !== null && (
          <div
            className="fixed inset-0 z-[100] bg-[#1a1a1a]/95 flex items-center justify-center p-4"
            onClick={() => setSelectedVideoIndex(null)}
          >
            {/* Top Bar inside modal */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
              <div className="text-pink-600/50 text-xl font-bold tracking-widest pl-4">
                NIMMATHI.COM
              </div>
              <button
                className="text-white hover:text-pink-300 transition-colors p-2"
                onClick={() => setSelectedVideoIndex(null)}
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Prev Button */}
            <button
              className="absolute left-2 md:left-8 text-white/50 hover:text-white transition-colors p-2 z-50"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-12 h-12" />
            </button>

            {/* Video Container */}
            <div
              className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videos[selectedVideoIndex].id}?autoplay=1`}
                title={videos[selectedVideoIndex].title}
                className="w-full h-full rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Next Button */}
            <button
              className="absolute right-2 md:right-8 text-white/50 hover:text-white transition-colors p-2 z-50"
              onClick={handleNext}
            >
              <ChevronRight className="w-12 h-12" />
            </button>

            {/* Pagination indicator */}
            <div className="absolute bottom-4 left-8 text-white/50 text-sm z-50">
              {selectedVideoIndex + 1} / {videos.length}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
