"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          { 
            pageLanguage: 'en', 
            includedLanguages: 'en,ta,ml,kn,te,hi',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE 
          },
          'google_translate_element'
        );
      }
    };
  }, []);

  const totalSteps = 11;

  const handleNext = () => {
    // Validate current step
    let errorMessage: string | null = null;

    switch (currentStep) {
      case 1:
        if (!answers.q1) {
          errorMessage = "Please choose any one option!";
        } else if (answers.q1 === "Acceptable" && !answers.q1_reason) {
          errorMessage = "You must tell the reason for accepting it";
        }
        break;
      case 2:
        if (!answers.q2) errorMessage = "Please choose any one option!";
        break;
      case 3:
        if (!answers.q3) errorMessage = "Please choose any one option!";
        break;
      case 4:
        if (!answers.q4) errorMessage = "Please choose any one option!";
        break;
      case 5:
        if (!answers.q5) errorMessage = "Please choose any one option!";
        break;
      case 6:
        if (!answers.q6) errorMessage = "Please choose any one option!";
        break;
      case 7:
        if (!answers.q7) errorMessage = "Please choose any one option!";
        break;
      case 8:
        if (!answers.q8) errorMessage = "Please choose any one option!";
        break;
      case 9:
        // Just a link
        break;
      case 10:
        // Just a request
        break;
      case 11:
        // Optional address
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
      console.log("Survey Completed:", answers);
      alert("Thank you for completing the survey!");
      // Reset or redirect here in future
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
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-8" style={{ backgroundColor: "#faf0f4" }}>

      {/* Headings */}
      <div className="text-center mb-8 w-full max-w-3xl notranslate">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#d81b60] tracking-wider uppercase">
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
            <h2 className="text-xl font-bold md:mb-0">Question No. {currentStep}</h2>
            <div id="google_translate_element" className="min-h-[30px] w-full md:w-auto"></div>
          </div>

          {/* Question 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                Dear brother, greetings in the name of Jesus Christ. Believing that you are a Christian who thinks progressively and is grounded in Scripture, I ask you this simple question. I humbly request that you please provide an answer.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-slate-700 font-medium">
                Some Christian churches and wedding halls on the same street have been built separately based on caste. Certain Christian cemeteries and funeral hearses are also segregated along caste lines. Christians often overlook fellow Christians based on caste when it comes to marriage. In your view, are these practices acceptable? Please give your candid response.
              </p>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q1" value="Acceptable" checked={answers.q1 === "Acceptable"} onChange={(e) => updateAnswer("q1", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>a) Acceptable</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q1" value="Not Acceptable" checked={answers.q1 === "Not Acceptable"} onChange={(e) => updateAnswer("q1", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>b) Not Acceptable</span>
                </label>
              </div>
              {answers.q1 === "Acceptable" && (
                <div className="mt-4">
                  <textarea
                    placeholder="If acceptable, please write the reason here."
                    className="w-full border border-blue-300 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                    rows={4}
                    value={answers.q1_reason || ""}
                    onChange={(e) => updateAnswer("q1_reason", e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>
          )}

          {/* Question 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                Good. Do you assure that, even if others consider caste regarding weddings in your family, you will not?
              </p>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q2" value="Yes" checked={answers.q2 === "Yes"} onChange={(e) => updateAnswer("q2", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>a) Yes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q2" value="No" checked={answers.q2 === "No"} onChange={(e) => updateAnswer("q2", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>b) No</span>
                </label>
              </div>
            </div>
          )}

          {/* Question 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                If the government were to consolidate those who identify as casteless—even though they belong to communities affected by the caste system—issue them a "Non-Caste" (NC) certificate, and provide a separate reservation quota for this category, would you be willing to switch to that category, brother?
              </p>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q3" value="Willing" checked={answers.q3 === "Willing"} onChange={(e) => updateAnswer("q3", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>a) Willing</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q3" value="No" checked={answers.q3 === "No"} onChange={(e) => updateAnswer("q3", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>b) No</span>
                </label>
              </div>
            </div>
          )}

          {/* Question 4 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                Brother, what is the reason that the caste-free brotherhood—known only to a few of us—remains unknown to many others?
              </p>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q4" value="Pastors do not preach it" checked={answers.q4 === "Pastors do not preach it"} onChange={(e) => updateAnswer("q4", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>a) Pastors do not preach it</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q4" value="The reason is unknown" checked={answers.q4 === "The reason is unknown"} onChange={(e) => updateAnswer("q4", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>b) The reason is unknown</span>
                </label>
              </div>
            </div>
          )}

          {/* Question 5 */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                What do you think is the reason why many preachers do not preach about caste-free brotherhood?
              </p>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q5" value="Fear of antagonizing believers who are caste-conscious" checked={answers.q5 === "Fear of antagonizing believers who are caste-conscious"} onChange={(e) => updateAnswer("q5", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>a) Fear of antagonizing believers who are caste-conscious</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q5" value="The preacher's own caste consciousness" checked={answers.q5 === "The preacher's own caste consciousness"} onChange={(e) => updateAnswer("q5", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>b) The preacher's own caste consciousness</span>
                </label>
              </div>
            </div>
          )}

          {/* Question 6 */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                In that case, shouldn't we—Christians who know that casteism is a sin—spread caste-free brotherhood within the church?
              </p>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q6" value="Yes" checked={answers.q6 === "Yes"} onChange={(e) => updateAnswer("q6", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>a) Yes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q6" value="No" checked={answers.q6 === "No"} onChange={(e) => updateAnswer("q6", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>b) No</span>
                </label>
              </div>
            </div>
          )}

          {/* Question 7 */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                The unity of those who believe in the caste system is a major reason why caste persists. Therefore, to liberate them from the caste system, we—who are casteless—must forge an even stronger unity among ourselves. <br /><br />
                Is what I am saying correct?
              </p>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q7" value="Yes" checked={answers.q7 === "Yes"} onChange={(e) => updateAnswer("q7", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>a) Yes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q7" value="No" checked={answers.q7 === "No"} onChange={(e) => updateAnswer("q7", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>b) No</span>
                </label>
              </div>
            </div>
          )}

          {/* Question 8 */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                To foster unity among those who are casteless, one must first identify them. To do this, you need to send the questions I provided to your fellow Christians one by one and survey them. Can you undertake this task, brother?
              </p>
              <div className="space-y-2 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q8" value="Yes, I can" checked={answers.q8 === "Yes, I can"} onChange={(e) => updateAnswer("q8", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>a) Yes, I can</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="q8" value="No, I cannot" checked={answers.q8 === "No, I cannot"} onChange={(e) => updateAnswer("q8", e.target.value)} className="w-4 h-4 text-blue-600" />
                  <span>b) No, I cannot</span>
                </label>
              </div>
            </div>
          )}

          {/* Question 9 */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                Click the link below to join our anti-caste group:
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
                To rapidly spread the message of casteless brotherhood, why don't you also set this image—"CASTELESS BROTHERHOOD INDIA"—as your profile picture (DP), just as many of us who oppose the caste system have done, brother?
              </p>
            </div>
          )}

          {/* Question 11 */}
          {currentStep === 11 && (
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                Brother, are you buying and wearing this shirt? Did you receive it? If you need it, please send your address.
              </p>
              <div className="mt-4">
                <textarea
                  placeholder="Enter your address here (optional)"
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
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            className="bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors shadow-sm"
          >
            {currentStep === totalSteps ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
