import Image from "next/image";
import Link from "next/link";

export default function BloodBankPage() {
  return (
    <div className="min-h-screen bg-pink-50 font-sans p-4 py-12 flex flex-col items-center text-center">
      <main className="max-w-4xl mx-auto w-full flex flex-col items-center">

        <h1 className="text-2xl md:text-3xl font-bold text-[#ad1457] mb-8">
          Blood Bank – இரத்த வங்கி
        </h1>

        <p className="text-[#c2185b] font-medium text-base md:text-lg mb-8 max-w-3xl leading-relaxed">
          இந்த உலக மக்களுக்காக முதன்முதலில் <span className="font-bold text-red-600">இரத்ததானம்</span> செய்த இயேசு கிறிஸ்துவின் தெய்வீகத் திருப்பெயரில் உங்களை வரவேற்கிறோம்.
        </p>

        <p className="text-[#d81b60] font-bold italic text-base md:text-lg mb-12 max-w-3xl leading-relaxed">
          "நான் உங்களிடம் அன்பு கொண்டிருந்ததுபோல நீங்களும் ஒருவர் மற்றவரிடம் அன்பு கொண்டிருக்க வேண்டும் என்பதே என் கட்டளை." - இயேசு கிறிஸ்து .
        </p>

        {/* Links to friends2support.org */}
        <a
          href="https://friends2support.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-700 underline font-semibold text-sm md:text-base mb-4 transition-colors"
        >
          இரத்த தானம் செய்யவும், இரத்த தானம் செய்பவரை கண்டுபிடிக்கவும் இங்கே சொடுக்கவும்.
        </a>

        <a
          href="https://friends2support.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-slate-700 underline font-bold text-lg md:text-xl mb-12 transition-colors"
        >
          Please Click here to donate blood or to find a blood donor.
        </a>

        {/* Images */}
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Logo Image */}
          <div className="w-full max-w-[500px] aspect-[4/3] bg-none rounded relative flex items-center justify-center p-4">
            <Image src="/images/blood-bank-logo.png" alt="Give Blood Save Life" fill className="object-contain p-4 z-10" />
          </div>

          {/* Jesus Image */}
          <div className="w-full max-w-[500px] bg-none rounded relative flex items-center justify-center">
            <Image src="/images/blood-bank-jesus.png" alt="Jesus Christ on the Cross" width={500} height={500} className="w-full h-auto object-contain z-10" />
          </div>
        </div>

      </main>
    </div>
  );
}
