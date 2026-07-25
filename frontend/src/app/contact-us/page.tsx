export default function ContactUs() {
  return (
    <div className="min-h-screen bg-pink-50 font-sans flex items-center justify-center p-4">
      <main className="max-w-2xl w-full">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-[#c2185b] mb-8 md:mb-12">Contact Us</h1>
        
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-md border-t-4 border-[#c2185b] text-slate-800 flex flex-col gap-6">
          
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#c2185b] mb-1">Bro. Augustine (Agathiyan)</h2>
          </div>

          <div className="flex flex-col gap-2 md:text-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className="font-semibold text-slate-700 min-w-[70px]">Phone:</span>
              <span className="font-medium">9941402590 / 9080490801 (Whatsapp)</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className="font-semibold text-slate-700 min-w-[70px]">E-mail:</span>
              <a href="mailto:mananimmathi@gmail.com" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                mananimmathi@gmail.com
              </a>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
