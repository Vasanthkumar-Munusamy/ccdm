"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  searchQuestions,
  SearchResultItem,
  MULTILINGUAL_QUESTIONS
} from "@/data/multilingualQuestions";
import { API_BASE_URL } from "@/config/api";

type SupportedLang = "ta" | "en" | "ml" | "kn" | "te" | "hi";

const PLACEHOLDERS: Record<SupportedLang, string> = {
  ta: "கேள்வி அல்லது பதில்களைத் தேடுங்கள்... (தமிழ், English, മലയാളം, ಕನ್ನಡ, తెలుగు)",
  en: "Search questions & answers in English, தமிழ், മലയാളം, ಕನ್ನಡ, తెలుగు...",
  ml: "ചോദ്യോത്തരങ്ങൾ തിരയുക... (മലയാളം, English, தமிழ், ಕನ್ನಡ, తెలుగు)",
  kn: "ಪ್ರಶ್ನೋತ್ತರಗಳನ್ನು ಹುಡುಕಿ... (ಕನ್ನಡ, English, தமிழ், മലയാളം, తెలుగు)",
  te: "ప్రశ్నోత్తరాలను వెతకండి... (తెలుగు, English, தமிழ், മലയാളം, ಕನ್ನಡ)",
  hi: "प्रश्नोत्तरी खोजें... (हिंदी, English, தமிழ், മലയാളം, ಕನ್ನಡ, తెలుగు)"
};

const NO_RESULTS: Record<SupportedLang, string> = {
  ta: "பொருத்தமான கேள்விகள் அல்லது பதில்கள் எதுவும் கிடைக்கவில்லை.",
  en: "No questions or answers found matching your search.",
  ml: "പൊരുത്തപ്പെടുന്ന ചോദ്യങ്ങളോ ഉത്തരങ്ങളോ കണ്ടെത്തിയില്ല.",
  kn: "ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯಾಗುವ ಪ್ರಶ್ನೆಗಳು ಅಥವಾ ಉತ್ತರಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
  te: "సరిపోలే ప్రశ్నలు లేదా సమాధానాలు ఏవీ కనుగొనబడలేదు.",
  hi: "आपकी खोज से मेल खाता कोई प्रश्न या उत्तर नहीं मिला।"
};

const SEARCH_LABEL: Record<SupportedLang, string> = {
  ta: "பொதுவான மற்றும் சாதி மறுப்புக் கேள்வி-பதில்களைத் தேடவும்",
  en: "Search Questions & Answers",
  ml: "ചോദ്യങ്ങളും ഉത്തരങ്ങളും തിരയുക",
  kn: "ಪ್ರಶ್ನೋತ್ತರಗಳನ್ನು ಹುಡುಕಿ",
  te: "ప్రశ్నలు మరియు సమాధానాలను వెతకండి",
  hi: "प्रश्न एवं उत्तर खोजें"
};

const IN_ANSWER_LABEL: Record<SupportedLang, string> = {
  ta: "விடையிலிருந்து",
  en: "In Answer",
  ml: "ഉത്തരത്തിൽ",
  kn: "ಉತ್ತರದಲ್ಲಿ",
  te: "సమాధానంలో",
  hi: "उत्तर में"
};

const ANSWER_PREFIX: Record<SupportedLang, string> = {
  ta: "பதில்:",
  en: "Answer:",
  ml: "ഉത്തരം:",
  kn: "ಉತ್ತರ:",
  te: "సమాధానం:",
  hi: "उत्तर:"
};

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<SupportedLang>("ta");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [liveQuestions, setLiveQuestions] = useState<
    { id: number; question: string; answer?: string; type: "common" | "caste-denial" }[]
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide on admin routes
  const isAdmin = pathname?.startsWith("/admin");

  // Detect currently active language from Google Translate
  const checkCurrentLang = useCallback(() => {
    if (typeof document === "undefined") return;

    // 1. Check goog-te-combo select element
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo && combo.value) {
      const val = combo.value.toLowerCase() as SupportedLang;
      if (["ta", "en", "ml", "kn", "te", "hi"].includes(val)) {
        setActiveLang(val);
        return;
      }
    }

    // 2. Check googtrans cookie: e.g. /ta/en or /auto/en
    const match = document.cookie.match(/googtrans=\/[^/]+\/([a-z]{2})/i);
    if (match && match[1]) {
      const val = match[1].toLowerCase() as SupportedLang;
      if (["ta", "en", "ml", "kn", "te", "hi"].includes(val)) {
        setActiveLang(val);
        return;
      }
    }

    // Default to 'ta'
    setActiveLang("ta");
  }, []);

  useEffect(() => {
    checkCurrentLang();
    const interval = setInterval(checkCurrentLang, 500);
    return () => clearInterval(interval);
  }, [checkCurrentLang]);

  // Fetch live questions & answers from database
  useEffect(() => {
    if (isAdmin) return;
    const fetchExtraQuestions = async () => {
      try {
        const [commonRes, casteRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/common-qa`).catch(() => null),
          fetch(`${API_BASE_URL}/api/qa`).catch(() => null)
        ]);

        const extras: { id: number; question: string; answer?: string; type: "common" | "caste-denial" }[] = [];

        if (commonRes && commonRes.ok) {
          const commonData = await commonRes.json();
          if (Array.isArray(commonData)) {
            commonData.forEach((q: any) => {
              extras.push({ id: q.id, question: q.question, answer: q.answer, type: "common" });
            });
          }
        }

        if (casteRes && casteRes.ok) {
          const casteData = await casteRes.json();
          if (Array.isArray(casteData)) {
            casteData.forEach((q: any) => {
              extras.push({ id: q.id, question: q.question, answer: q.answer, type: "caste-denial" });
            });
          }
        }

        setLiveQuestions(extras);
      } catch (e) {
        // Fall back gracefully
      }
    };

    fetchExtraQuestions();
  }, [isAdmin]);

  // Synchronous search across questions and answers
  const runSearch = useCallback(
    (searchTerm: string, lang: SupportedLang) => {
      const trimmed = searchTerm.trim();
      if (!trimmed) {
        setResults([]);
        setIsOpen(false);
        setSelectedIndex(-1);
        return;
      }

      const matched = searchQuestions(trimmed, lang, liveQuestions);
      setResults(matched);
      setIsOpen(true);
      setSelectedIndex(-1);
    },
    [liveQuestions]
  );

  // When active language or live questions change, re-run search if query is non-empty
  useEffect(() => {
    if (query.trim()) {
      runSearch(query, activeLang);
    }
  }, [activeLang, liveQuestions, runSearch]);

  // Click / Touch outside listener to close dropdown
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        runSearch(query, activeLang);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery("");
    router.push(item.path);
  };

  if (isAdmin) return null;

  // Safe substring highlighter
  const highlightMatch = (text: string, sub: string) => {
    if (!text) return "";
    if (!sub || !sub.trim()) return text;
    const trimmed = sub.trim();
    try {
      const escaped = trimmed.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      const parts = text.split(regex);
      if (parts.length <= 1) return text;
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === trimmed.toLowerCase() ? (
              <mark key={i} className="bg-amber-200 text-slate-900 font-bold rounded px-0.5">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch {
      return text;
    }
  };

  return (
    <div className="w-full relative z-40 bg-gradient-to-b from-[#fce4ec] to-[#f8bbd0] border-b border-pink-200 shadow-sm py-2.5 px-4">
      <div ref={containerRef} className="max-w-3xl mx-auto relative z-50">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-pink-600 pointer-events-none flex items-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              runSearch(val, activeLang);
            }}
            onFocus={() => {
              if (query.trim()) {
                runSearch(query, activeLang);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[activeLang] || PLACEHOLDERS.ta}
            aria-label={SEARCH_LABEL[activeLang]}
            className="w-full pl-11 pr-10 py-2.5 bg-white text-slate-800 placeholder-slate-400 text-sm md:text-base rounded-full border border-pink-300 focus:outline-none focus:ring-2 focus:ring-[#c2185b] focus:border-transparent shadow-sm"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 text-pink-600 hover:text-pink-800 hover:bg-pink-100 p-1 rounded-full focus:outline-none transition-colors"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Matched Questions Dropdown Rendered Below */}
        {isOpen && query.trim().length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col max-h-[75vh]"
            style={{ zIndex: 9999 }}
          >
            {/* Header / Matches counter */}
            <div className="bg-[#fdf2f8] px-4 py-2 border-b border-pink-100 flex items-center justify-between text-xs font-semibold text-[#ad1457]">
              <span>
                {results.length > 0
                  ? `${results.length} ${
                      results.length === 1 ? "match found" : "matches found"
                    }`
                  : "Search Results"}
              </span>
              <span className="text-slate-500 font-normal">
                Language: <span className="font-semibold uppercase text-pink-700">{activeLang}</span>
              </span>
            </div>

            {/* List of Matched Questions */}
            <div className="overflow-y-auto divide-y divide-pink-50 p-1">
              {results.length === 0 ? (
                <div className="py-8 px-4 text-center text-slate-500 text-sm">
                  <p className="mb-1">{NO_RESULTS[activeLang] || NO_RESULTS.ta}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Try searching in English, Tamil, Malayalam, Kannada, or Telugu
                  </p>
                </div>
              ) : (
                results.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex flex-col gap-1.5 focus:outline-none ${
                        isSelected
                          ? "bg-pink-100 text-slate-900"
                          : "hover:bg-pink-50/80 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                            item.type === "common"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-pink-100 text-[#ad1457] border border-pink-200"
                          }`}
                        >
                          {item.categoryLabel}
                        </span>

                        {item.matchedIn === "answer" && (
                          <span className="text-[10px] font-medium bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                            {IN_ANSWER_LABEL[activeLang] || IN_ANSWER_LABEL.ta}
                          </span>
                        )}

                        {item.matchedInLang && item.matchedInLang !== activeLang && item.matchedInLang !== "keywords" && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            (matched via {item.matchedInLang.toUpperCase()})
                          </span>
                        )}
                      </div>

                      <div className="text-sm md:text-base font-medium leading-snug">
                        {highlightMatch(item.displayQuestion, query)}
                      </div>

                      {/* If matched inside the answer text, show a snippet with the match highlighted */}
                      {item.answerSnippet && (
                        <div className="mt-1 text-xs text-slate-700 bg-amber-50/80 border border-amber-200/80 rounded-md p-2 leading-relaxed font-normal">
                          <span className="font-semibold text-amber-900 mr-1.5">
                            {ANSWER_PREFIX[activeLang] || ANSWER_PREFIX.ta}
                          </span>
                          <span>{highlightMatch(item.answerSnippet, query)}</span>
                        </div>
                      )}

                      {/* If the matched text is from another translation language, show helper */}
                      {item.matchedText &&
                        item.matchedText !== item.displayQuestion &&
                        item.matchedText.toLowerCase().includes(query.toLowerCase().trim()) && (
                          <div className="text-xs text-slate-500 italic flex items-center gap-1">
                            <span>Matched:</span>
                            <span>{highlightMatch(item.matchedText, query)}</span>
                          </div>
                        )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with keyboard tip */}
            {results.length > 0 && (
              <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Press ↑ ↓ to navigate, Enter to view</span>
                <span>ESC to close</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
