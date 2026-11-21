"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

export default function Home() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [modalState, setModalState] = useState<{ isOpen: boolean, type: 'success' | 'error', message: string }>({
    isOpen: false,
    type: 'success',
    message: ''
  });

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    if (modalState.type === 'success') {
      router.push('/caste-denial-qa');
    }
  };



  const totalSteps = 11;

  const handleNext = async () => {
    // Validate current step
    let errorMessage: string | null = null;

    switch (currentStep) {
      case 1:
        if (!answers.q1) {
          errorMessage = "தயவுசெய்து ஏதேனும் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்!";
        } else if (answers.q1 === "Acceptable" && !answers.q1_reason) {
          errorMessage = "ஏற்றுக்கொள்வதற்கான காரணத்தை நீங்கள் தெரிவிக்க வேண்டும்";
        }
        break;
      case 2:
        if (!answers.q2) errorMessage = "தயவுசெய்து ஏதேனும் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்!";
        break;
      case 3:
        if (!answers.q3) errorMessage = "தயவுசெய்து ஏதேனும் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்!";
        break;
      case 4:
        if (!answers.q4) errorMessage = "தயவுசெய்து ஏதேனும் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்!";
        break;
      case 5:
        if (!answers.q5) errorMessage = "தயவுசெய்து ஏதேனும் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்!";
        break;
      case 6:
        if (!answers.q6) errorMessage = "தயவுசெய்து ஏதேனும் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்!";
        break;
      case 7:
        if (!answers.q7) errorMessage = "தயவுசெய்து ஏதேனும் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்!";
        break;
      case 8:
        if (!answers.q8) errorMessage = "தயவுசெய்து ஏதேனும் ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்!";
        break;
      case 9:
        // Just a link
        break;
      case 10:
        // Just a request
        break;
      case 11:
        if (!answers.name || !answers.email || !answers.phone || !answers.q11_address) {
          errorMessage = "முடிக்க உங்கள் பெயர், மின்னஞ்சல், தொலைபேசி மற்றும் முகவரியை உள்ளிடவும்.";
        }
        break;
    }

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError(null);
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      try {
        const payload = {
          name: answers.name,
          email: answers.email,
          phone: answers.phone,
          address: answers.q11_address,
          answers: answers
        };

        const response = await fetch(`${API_BASE_URL}/api/survey`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          if (response.status === 409) {
            const errorData = await response.json();
            setModalState({ isOpen: true, type: 'error', message: errorData.error });
            return;
          }
          throw new Error("Failed to submit survey");
        }

        console.log("Survey Completed:", answers);
        setModalState({ isOpen: true, type: 'success', message: "கருத்துக்கணிப்பில் பங்கேற்றதற்கு நன்றி!" });
      } catch (err) {
        console.error(err);
        setModalState({ isOpen: true, type: 'error', message: "உங்கள் பதிலைச் சமர்ப்பிப்பதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்." });
      }
    }
  };

  const handlePrevious = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAnswer = (key: string, value: any) => {
    setAnswers({ ...answers, [key]: value });
    setError(null); // Clear error on change
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 md:pt-32" style={{ backgroundColor: "#faf0f4" }}>

        {/* Headings */}
        <div className="text-center mb-8 w-full max-w-3xl notranslate">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 text-[#d81b60] tracking-wider uppercase break-words px-2">
            NIMMATHI.COM
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-[#d81b60]">
            Christian Caste Disclaimers Movement (CCDM)
          </h2>
        </div>

        <div className="w-full max-w-3xl bg-[#fdf2f8] shadow-sm p-6 md:p-10 rounded-sm text-slate-800" style={{ border: "1px solid #fce7f3" }}>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5] rounded flex items-center justify-between">
              <span>{error}</span>
              <span className="font-bold cursor-pointer text-xl" onClick={() => setError(null)}>&times;</span>
            </div>
          )}

          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-xl font-bold md:mb-0">கேள்வி எண்: <span>{currentStep}</span></h2>
            </div>

            {/* Question 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  அன்பான சகோதரரே, இயேசு கிறிஸ்துவின் நாமத்தில் வாழ்த்துக்கள். வேதத்தை அடிப்படையாகக் கொண்டு, முற்போக்காகச் சிந்திக்கும் கிறிஸ்தவராக நீங்கள் இருப்பீர்கள் என்ற நம்பிக்கையில், இந்த எளிய கேள்வியை உங்களிடம் கேட்கிறேன். இதற்குத் தாங்கள் தயவுசெய்து பதிலளிக்குமாறு அன்போடு கேட்டுக்கொள்கிறேன்.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  ஒரே தெருவில் சில கிறிஸ்தவ ஆலயங்களும், திருமண மண்டபங்களும் சாதி வாரியாகத் தனித்தனியாகக் கட்டப்பட்டுள்ளன. சில கிறிஸ்தவக் கல்லறைத் தோட்டங்களும், சவப்பெட்டி வண்டிகளும் கூட சாதி அடிப்படையில் பிரிக்கப்பட்டுள்ளன. மேலும் திருமண விஷயத்தில் கிறிஸ்தவர்கள் சக கிறிஸ்தவர்களைச் சாதியின் அடிப்படையில் புறக்கணிக்கின்றனர். உங்கள் பார்வையில் இந்த நடைமுறைகள் ஏற்றுக்கொள்ளத்தக்கவையா? உங்கள் வெளிப்படையான பதிலை அளியுங்கள்.
                </p>
                <div className="space-y-2 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q1" value="Acceptable" checked={answers.q1 === "Acceptable"} onChange={(e) => updateAnswer("q1", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>அ) ஏற்றுக்கொள்ளத்தக்கது</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q1" value="Not Acceptable" checked={answers.q1 === "Not Acceptable"} onChange={(e) => updateAnswer("q1", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>ஆ) ஏற்றுக்கொள்ள முடியாதது</span>
                  </label>
                </div>
                {answers.q1 === "Acceptable" && (
                  <div className="mt-4">
                    <textarea
                      placeholder="ஏற்றுக்கொள்ளத்தக்கது என்றால், அதற்கான காரணத்தை இங்கே எழுதவும்."
                      className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                      rows={4}
                      value={answers.q1_reason || ""}
                      onChange={(e) => updateAnswer("q1_reason", e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (answers.q1_reason && answers.q1_reason.trim() !== "") {
                            router.push('/thank-you');
                          } else {
                            setError("சமர்ப்பிப்பதற்கு முன் தயவுசெய்து காரணத்தைக் குறிப்பிடவும்.");
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
                      >
                        சமர்ப்பிக்கவும்
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Question 2 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  நல்லது. உங்கள் குடும்பத் திருமணங்களில் மற்றவர்கள் சாதியைப் பார்த்தாலும், நீங்கள் சாதி பார்க்கமாட்டீர்கள் என்று உறுதியளிக்கிறீர்களா?
                </p>
                <div className="space-y-2 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q2" value="Yes" checked={answers.q2 === "Yes"} onChange={(e) => updateAnswer("q2", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>அ) ஆம்</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q2" value="No" checked={answers.q2 === "No"} onChange={(e) => updateAnswer("q2", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>ஆ) இல்லை</span>
                  </label>
                </div>
                {answers.q2 === "No" && (
                  <div className="mt-4">
                    <textarea
                      placeholder="இல்லை என்றால், அதற்கான காரணத்தை இங்கே எழுதவும்."
                      className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                      rows={4}
                      value={answers.q2_reason || ""}
                      onChange={(e) => updateAnswer("q2_reason", e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (answers.q2_reason && answers.q2_reason.trim() !== "") {
                            router.push('/thank-you');
                          } else {
                            setError("சமர்ப்பிப்பதற்கு முன் தயவுசெய்து காரணத்தைக் குறிப்பிடவும்.");
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
                      >
                        சமர்ப்பிக்கவும்
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Question 3 */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  சாதி அமைப்பினால் பாதிக்கப்பட்ட சமூகங்களைச் சேர்ந்தவர்களாக இருந்தாலும், தங்களைச் சாதியற்றவர்களாகக் கருதுபவர்களை அரசு ஒன்றிணைத்து, அவர்களுக்கு "சாதியற்றவர்" (Non-Caste - NC) சான்றிதழ் வழங்கி, இந்தப் பிரிவுக்குத் தனி இடஒதுக்கீடு வழங்கினால், நீங்கள் அந்தப் பிரிவுக்கு மாறத் தயாரா, சகோதரரே?
                </p>
                <div className="space-y-2 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q3" value="Yes" checked={answers.q3 === "Yes"} onChange={(e) => updateAnswer("q3", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>அ) ஆம்</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q3" value="No" checked={answers.q3 === "No"} onChange={(e) => updateAnswer("q3", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>ஆ) இல்லை</span>
                  </label>
                </div>
                {answers.q3 === "No" && (
                  <div className="mt-4">
                    <textarea
                      placeholder="இல்லை என்றால், அதற்கான காரணத்தை இங்கே எழுதவும்."
                      className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                      rows={4}
                      value={answers.q3_reason || ""}
                      onChange={(e) => updateAnswer("q3_reason", e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (answers.q3_reason && answers.q3_reason.trim() !== "") {
                            router.push('/thank-you');
                          } else {
                            setError("சமர்ப்பிப்பதற்கு முன் தயவுசெய்து காரணத்தைக் குறிப்பிடவும்.");
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
                      >
                        சமர்ப்பிக்கவும்
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Question 4 */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  சகோதரரே, நம்மில் ஒரு சிலருக்கு மட்டுமே தெரிந்த சாதியற்ற சகோதரத்துவம், பலருக்குத் தெரியாமல் இருப்பதற்கு என்ன காரணம்?
                </p>
                <div className="space-y-2 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q4" value="Pastors do not preach it" checked={answers.q4 === "Pastors do not preach it"} onChange={(e) => updateAnswer("q4", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>அ) போதகர்கள் இதை பிரசங்கிப்பதில்லை</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q4" value="The reason is unknown" checked={answers.q4 === "The reason is unknown"} onChange={(e) => updateAnswer("q4", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>ஆ) காரணம் தெரியவில்லை</span>
                  </label>
                </div>
              </div>
            )}

            {/* Question 5 */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  சாதியற்ற சகோதரத்துவத்தைப் பற்றிப் பல போதகர்கள் பிரசங்கிக்காததற்கு என்ன காரணம் என்று நீங்கள் நினைக்கிறீர்கள்?
                </p>
                <div className="space-y-2 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q5" value="Fear of antagonizing believers who are caste-conscious" checked={answers.q5 === "Fear of antagonizing believers who are caste-conscious"} onChange={(e) => updateAnswer("q5", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>அ) சாதி உணர்வுள்ள விசுவாசிகளைப் பகைத்துக் கொள்வோமோ என்ற பயம்</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q5" value="The preacher's own caste consciousness" checked={answers.q5 === "The preacher's own caste consciousness"} onChange={(e) => updateAnswer("q5", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>ஆ) போதகரின் சொந்த சாதி உணர்வு</span>
                  </label>
                </div>
              </div>
            )}

            {/* Question 6 */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  அப்படியானால், சாதிப் பாகுபாடு பாவம் என்று அறிந்த கிறிஸ்தவர்களாகிய நாம்தான் திருச்சபைக்குள் சாதியற்ற சகோதரத்துவத்தைப் பரப்ப வேண்டும்—அல்லவா?
                </p>
                <div className="space-y-2 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q6" value="Yes" checked={answers.q6 === "Yes"} onChange={(e) => updateAnswer("q6", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>அ) ஆம்</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q6" value="No" checked={answers.q6 === "No"} onChange={(e) => updateAnswer("q6", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>ஆ) இல்லை</span>
                  </label>
                </div>
                {answers.q6 === "No" && (
                  <div className="mt-4">
                    <textarea
                      placeholder="இல்லை என்றால், அதற்கான காரணத்தை இங்கே எழுதவும்."
                      className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                      rows={4}
                      value={answers.q6_reason || ""}
                      onChange={(e) => updateAnswer("q6_reason", e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (answers.q6_reason && answers.q6_reason.trim() !== "") {
                            router.push('/thank-you');
                          } else {
                            setError("சமர்ப்பிப்பதற்கு முன் தயவுசெய்து காரணத்தைக் குறிப்பிடவும்.");
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
                      >
                        சமர்ப்பிக்கவும்
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Question 7 */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  சாதி அமைப்பை நம்புபவர்களின் ஒற்றுமையே சாதி நீடிப்பதற்குக் முக்கிய காரணம். எனவே, அவர்களைச் சாதி அமைப்பிலிருந்து விடுவிக்க, சாதியற்ற நாம் நமக்குள் இன்னும் வலுவான ஒற்றுமையை உருவாக்க வேண்டும். <br /><br />
                  நான் சொல்வது சரிதானே?
                </p>
                <div className="space-y-2 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q7" value="Yes" checked={answers.q7 === "Yes"} onChange={(e) => updateAnswer("q7", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>அ) ஆம்</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q7" value="No" checked={answers.q7 === "No"} onChange={(e) => updateAnswer("q7", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>ஆ) இல்லை</span>
                  </label>
                </div>
                {answers.q7 === "No" && (
                  <div className="mt-4">
                    <textarea
                      placeholder="இல்லை என்றால், அதற்கான காரணத்தை இங்கே எழுதவும்."
                      className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                      rows={4}
                      value={answers.q7_reason || ""}
                      onChange={(e) => updateAnswer("q7_reason", e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (answers.q7_reason && answers.q7_reason.trim() !== "") {
                            router.push('/thank-you');
                          } else {
                            setError("சமர்ப்பிப்பதற்கு முன் தயவுசெய்து காரணத்தைக் குறிப்பிடவும்.");
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
                      >
                        சமர்ப்பிக்கவும்
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Question 8 */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  சாதியற்றவர்களிடையே ஒற்றுமையை வளர்க்க, முதலில் அவர்களை அடையாளம் காண வேண்டும். இதற்கு, நான் வழங்கிய கேள்விகளை உங்கள் சக கிறிஸ்தவர்களுக்கு ஒவ்வொன்றாக அனுப்பி, அவர்களது கருத்துக்களைக் கணக்கெடுக்க வேண்டும். இந்த பணியை நீங்கள் செய்ய முடியுமா, சகோதரரே?
                </p>
                <div className="space-y-2 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q8" value="Yes, I can" checked={answers.q8 === "Yes, I can"} onChange={(e) => updateAnswer("q8", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>அ) ஆம், என்னால் முடியும்</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="q8" value="No, I cannot" checked={answers.q8 === "No, I cannot"} onChange={(e) => updateAnswer("q8", e.target.value)} className="w-4 h-4 text-blue-600" />
                    <span>ஆ) இல்லை, என்னால் முடியாது</span>
                  </label>
                </div>
                {answers.q8 === "No, I cannot" && (
                  <div className="mt-4">
                    <textarea
                      placeholder="முடியாது என்றால், அதற்கான காரணத்தை இங்கே எழுதவும்."
                      className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                      rows={4}
                      value={answers.q8_reason || ""}
                      onChange={(e) => updateAnswer("q8_reason", e.target.value)}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          if (answers.q8_reason && answers.q8_reason.trim() !== "") {
                            router.push('/thank-you');
                          } else {
                            setError("சமர்ப்பிப்பதற்கு முன் தயவுசெய்து காரணத்தைக் குறிப்பிடவும்.");
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
                      >
                        சமர்ப்பிக்கவும்
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Question 9 */}
            {currentStep === 9 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  சாதி எதிர்ப்பு குழுவில் இணைய கீழே உள்ள இணைப்பைக் கிளிக் செய்யவும்:
                </p>
                <a href="https://chat.whatsapp.com/E7uCyiyJ2E6Bwj1fdw8kAI?mode=gi_t" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium break-all">
                  https://chat.whatsapp.com/E7uCyiyJ2E6Bwj1fdw8kAI?mode=gi_t
                </a>
              </div>
            )}

            {/* Question 10 */}
            {currentStep === 10 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  சாதியற்ற சகோதரத்துவத்தின் செய்தியை விரைவாகப் பரப்ப, சாதி அமைப்பை எதிர்க்கும் எங்களில் பலர் செய்தது போல, "சாதியற்ற சகோதரத்துவம் இந்தியா" என்ற இந்த படத்தை நீங்களும் உங்கள் முகப்பு படமாக (DP) ஏன் வைக்கக்கூடாது, சகோதரரே?
                </p>
                <div className="flex flex-col md:flex-row gap-4 mt-6 justify-center items-center">
                  <img src="/cbi-logo-1.jpg" alt="Casteless Brotherhood India Kannada" className="w-full max-w-[200px] h-auto rounded-lg shadow-sm border border-slate-200" />
                  <img src="/cbi-logo-2.jpg" alt="Casteless Brotherhood India Tamil" className="w-full max-w-[200px] h-auto rounded-lg shadow-sm border border-slate-200" />
                  <img src="/cbi-logo-3.jpg" alt="Casteless Brotherhood India English" className="w-full max-w-[200px] h-auto rounded-lg shadow-sm border border-slate-200" />
                </div>
              </div>
            )}

            {/* Question 11 */}
            {currentStep === 11 && (
              <div className="space-y-4">
                <p className="text-sm md:text-base leading-relaxed text-slate-700">
                  சகோதரரே, இந்த சட்டையை வாங்கி அணிகிறீர்களா? உங்களுக்குக் கிடைத்ததா? தேவைப்பட்டால், உங்கள் முகவரியை அனுப்பி வைக்கவும்.
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <img src="/shirt-0.jpg" alt="Yellow and White Shirt" className="w-full h-full object-cover rounded-lg shadow-sm border border-slate-200" />
                  <img src="/shirt-1.jpg" alt="Yellow and White Shirts" className="w-full h-full object-cover rounded-lg shadow-sm border border-slate-200" />
                  <img src="/shirt-2.png" alt="Pink Shirt" className="w-full h-full object-cover rounded-lg shadow-sm border border-slate-200" />
                  <img src="/shirt-3.png" alt="White Shirt" className="w-full h-full object-cover rounded-lg shadow-sm border border-slate-200" />
                </div>
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="உங்கள் பெயரை உள்ளிடவும்"
                    className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                    value={answers.name || ""}
                    onChange={(e) => updateAnswer("name", e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="உங்கள் மின்னஞ்சலை உள்ளிடவும்"
                    className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                    value={answers.email || ""}
                    onChange={(e) => updateAnswer("email", e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்"
                    className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                    value={answers.phone || ""}
                    onChange={(e) => updateAnswer("phone", e.target.value)}
                  />
                  <textarea
                    placeholder="உங்கள் முகவரியை உள்ளிடவும்"
                    className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                    rows={4}
                    value={answers.q11_address || ""}
                    onChange={(e) => updateAnswer("q11_address", e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}

            {/* WhatsApp Group Button */}
            <div className="mt-8 flex justify-start">
              <a href="https://chat.whatsapp.com/Lwno6Fhv1by54M0wZzCdSv" target="_blank" rel="noopener noreferrer" className="flex items-center group transition-transform transform hover:scale-105">
                <div className="z-10 bg-white rounded-full p-[2px] shadow-sm flex items-center justify-center h-14 w-14 relative" style={{ marginRight: '-18px' }}>
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#25D366] fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="bg-black text-white pl-6 pr-6 py-2 rounded-r-full flex flex-col justify-center items-center h-12 shadow-md">
                  <span className="font-bold text-lg leading-[1.1] tracking-wide">Whatsapp</span>
                  <span className="font-bold text-sm text-[#25D366] leading-[1.1] tracking-[0.2em] uppercase mt-[2px]">Group</span>
                </div>
              </a>
            </div>

          </div>

          {/* Navigation Buttons */}
          <div className={`mt-10 flex ${currentStep > 1 ? 'justify-between' : 'justify-end'}`}>
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
              >
                முந்தையது
              </button>
            )}
            {!((currentStep === 1 && answers.q1 === "Acceptable") || (currentStep === 2 && answers.q2 === "No") || (currentStep === 3 && answers.q3 === "No") || (currentStep === 6 && answers.q6 === "No") || (currentStep === 7 && answers.q7 === "No") || (currentStep === 8 && answers.q8 === "No, I cannot")) && (
              <button
                onClick={handleNext}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
              >
                {currentStep === totalSteps ? "முடிக்க" : "அடுத்தது"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full border border-slate-200">
            <h3 className={`text-xl font-bold mb-3 ${modalState.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {modalState.type === 'success' ? 'Success!' : 'Notice'}
            </h3>
            <p className="text-slate-700 mb-6">{modalState.message}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
