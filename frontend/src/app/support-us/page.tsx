"use client";

import { useState } from "react";

export default function SupportUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while sending the message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 font-sans p-4 py-12">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-xl md:text-3xl font-bold text-center text-[#c2185b] mb-8 md:mb-12">Support us – எங்களுக்கு உதவ</h1>
        
        <div className="text-slate-800 space-y-6 text-sm md:text-base leading-relaxed mb-12 px-4 md:px-0">
          <p>அன்பான சகோதரர்களே,</p>
          <p>இயேசுவின் நாமத்தில் வாழ்த்துக்கள்!</p>
          <p>
            அன்பே பிரதானம் மூலம் செய்யப்படும் எல்லா அருட்பணிகளும் எல்லா தரப்பு மக்களுக்கும் மிகவும் பயனுள்ளதாக அமைவது நீங்கள் கடவுளிடம் உங்களை அர்ப்பணித்து நீங்கள் எங்களுக்கு செய்யும் பெரிய உதவியாக இருக்கும்.
          </p>
          <p>
            <strong>சாதி உணர்வு கிறிஸ்தவத்துக்கு விரோதமான பாவம்</strong> என்று நாங்கள் பிரசுரிப்பதும், போதிக்கிறோம் என்று அழைக்கப்படும் பலர்க்கு ஊழியத்தை புரிந்துகொள்ளாமல் எதிர்க்கிறார்கள். இந்த ஊழியத்தை அழிப்பதற்காக பல பரிசுகள் எங்களுக்கு எதிராக அநேகமாக பரப்புகிறார்கள். இயேசு கிறிஸ்து திரும்ப வருவதற்கு எளிதாக வந்தாலும் அவரை கிறிஸ்தவர்களாயிருப்பவர்களாய் சிறுமையாய் அறைந்து கொன்று விடுவார்கள்போல இருக்கிறது. <strong className="text-red-600">பாஸ்டர்கள் ஜாதி வெறியிலிருந்து இரட்சிக்கப்பட தயவு செய்து உருக்கமாக கடவுளிடம் மன்றாடுங்கள்.</strong>
          </p>
          <p>
            அருட்பணிகளுக்கு பொருளாதார உதவி செய்ய முன்வருபவர்கள் இயேசுவின் நாமத்தில் வரவேற்கிறோம்.
          </p>
          <p className="text-[#c2185b] font-medium">
            உங்களது உதாரத்துவமான காணிக்கைகளை கீழ்க்காணும் வங்கிக்கணக்கிற்கு அனுப்பலாம்.
          </p>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md border-t-4 border-[#c2185b] mb-12">
          <div className="space-y-4 text-slate-800 font-medium">
            <p>பெயர்: <span className="font-bold text-slate-900 ml-2">J. Augustine</span></p>
            <p>வங்கி: <span className="font-bold text-slate-900 ml-2">Indian Overseas Bank, Perambur</span></p>
            <p>கணக்கு எண்: <span className="font-bold text-slate-900 ml-2">057001000030581</span></p>
            <p>IFSC Code: <span className="font-bold text-slate-900 ml-2">IOBA0000570</span></p>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="font-bold text-slate-900">Google Pay : <span className="text-blue-700 ml-1">9941402590</span></p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg border border-pink-100 flex flex-col items-center justify-center text-center max-w-lg mx-auto mb-12">
          <h2 className="text-[#c2185b] font-bold text-lg md:text-2xl mb-6">
            Please scan the below QR code and transfer the price for the books.
          </h2>
          
          <div className="w-64 h-64 bg-slate-100 flex items-center justify-center border-2 border-slate-300 rounded mb-6">
            {/* Placeholder for actual QR code */}
            <span className="text-slate-400 text-sm p-4 border border-dashed border-slate-400">
              [Place your QR Code Image Here]
            </span>
          </div>
          
          <p className="text-slate-600 mb-4">mananimmathi@okhdfcbank</p>
          <h3 className="text-3xl font-bold text-slate-800 mb-2">அன்பே பிரதானம்</h3>
          <p className="text-slate-700 font-medium mb-1">mananimmathi@gmail.com</p>
          <p className="text-slate-700 font-medium mb-4">+91 99414 02590</p>
          <p className="text-slate-600 font-semibold mb-2">Scan my QR code to pay</p>
          <p className="text-blue-700 font-bold text-2xl">G-Pay No: 9941402590</p>
        </div>

        <div className="mb-10 px-4 md:px-0">
          <p className="font-bold text-slate-900">PhonePe : <span className="text-blue-700 ml-1">9941402590</span></p>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Your name</label>
              <input 
                type="text" 
                id="name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border border-slate-300 text-slate-900 rounded-md p-2 focus:ring-[#c2185b] focus:border-[#c2185b]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Your email</label>
              <input 
                type="email" 
                id="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border border-slate-300 text-slate-900 rounded-md p-2 focus:ring-[#c2185b] focus:border-[#c2185b]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input 
                type="text" 
                id="subject"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                className="w-full border border-slate-300 text-slate-900 rounded-md p-2 focus:ring-[#c2185b] focus:border-[#c2185b]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Your message (optional)</label>
              <textarea 
                id="message"
                rows={4}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full border border-slate-300 text-slate-900 rounded-md p-2 focus:ring-[#c2185b] focus:border-[#c2185b]"
              ></textarea>
            </div>
            
            <button 
              type="submit"
              disabled={submitting}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium py-2 px-6 rounded transition-colors disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send"}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
