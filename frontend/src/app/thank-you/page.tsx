import Link from "next/link";

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#faf0f4" }}>
      <div className="w-full max-w-xl bg-[#fdf2f8] shadow-sm p-8 md:p-12 rounded-sm text-center border border-[#fce7f3]">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-[#d81b60] mb-4">Thank You!</h1>
        <p className="text-slate-700 text-lg mb-8">
          Your response has been successfully submitted. We appreciate your honest feedback.
        </p>
        <Link 
          href="/"
          className="inline-block bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-3 px-8 rounded transition-colors shadow-sm"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
