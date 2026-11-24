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
  ta: "கேள்விகளைத் தேடுங்கள்... (தமிழ், English, മലയാളം, ಕನ್ನಡ, తెలుగు)",
  en: "Search questions in English, தமிழ், മലയാളം, ಕನ್ನಡ, తెలుగు...",
  ml: "ചോദ്യങ്ങൾ തിരയുക... (മലയാളം, English, தமிழ், ಕನ್ನಡ, తెలుగు)",
  kn: "ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ... (ಕನ್ನಡ, English, தமிழ், മലയാളം, తెలుగు)",
  te: "ప్రశ్నలను వెతకండి... (తెలుగు, English, தமிழ், മലയാളം, ಕನ್ನಡ)",
  hi: "प्रश्न खोजें... (हिंदी, English, தமிழ், മലയാളം, ಕನ್ನಡ, తెలుగు)"
};

const NO_RESULTS: Record<SupportedLang, string> = {
  ta: "பொருத்தமான கேள்விகள் எதுவும் கிடைக்கவில்லை. வேறு சொல்லைப் பயன்படுத்தி முயற்சிக்கவும்.",
  en: "No questions found matching your search. Try another keyword.",
  ml: "പൊരുത്തപ്പെടുന്ന ചോദ്യങ്ങളൊന്നും കണ്ടെത്തിയില്ല. മറ്റൊരു വാക്ക് ഉപയോഗിച്ച് ശ്രമിക്കുക.",
  kn: "ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯಾಗುವ ಪ್ರಶ್ನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಪದವನ್ನು ಬಳಸಿ ಪ್ರಯತ್ನಿಸಿ.",
  te: "సరిపోలే ప్రశ్నలు ఏవీ కనుగొనబడలేదు. మరొక పదాన్ని ప్రయత్నించండి.",
  hi: "आपकी खोज से मेल खाता कोई प्रश्न नहीं मिला। कृपया कोई अन्य शब्द खोजें।"
};

const SEARCH_LABEL: Record<SupportedLang, string> = {
  ta: "பொதுவான மற்றும் சாதி மறுப்புக் கேள்விகளைத் தேடவும்",
  en: "Search Common & Caste Denial Questions",
  ml: "പൊതുവായതും ജാതി നിഷേധവുമായ ചോദ്യങ്ങൾ തിരയുക",
  kn: "ಸಾಮಾನ್ಯ ಮತ್ತು ಜಾತಿ ನಿರಾಕರಣೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ",
  te: "సాధారణ మరియు కుల వ్యతిరేక ప్రశ్నలను వెతకండి",
  hi: "सामान्य एवं जाति-निषेध प्रश्न खोजें"
};

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<SupportedLang>("ta");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [liveQuestions, setLiveQuestions] = useState<
    { id: number; question: string; type: "common" | "caste-denial" }[]
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide on admin routes
  const isAdmin = pathname?.startsWith("/admin");

  // Detect currently active language from Google Translate
  const checkCurrentLang = useCallback(() => {
    if (typeof document === "undefined") return;

    // Check goog-te-combo select element
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo && combo.value) {
      const val = combo.value.toLowerCase() as SupportedLang;
      if (["ta", "en", "ml", "kn", "te", "hi"].includes(val)) {
        setActiveLang(val);
        return;
      }
    }

    // Check googtrans cookie: e.g. /ta/en or /auto/en
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
    const interval = setInterval(checkCurrentLang, 600);
    return () => clearInterval(interval);
  }, [checkCurrentLang]);

  // Fetch live questions from database once to capture any new admin-added questions
  useEffect(() => {
    if (isAdmin) return;
    const fetchExtraQuestions = async () => {
      try {
        const [commonRes, casteRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/common-qa`).catch(() => null),
          fetch(`${API_BASE_URL}/api/qa`).catch(() => null)
        ]);

        const extras: { id: number; question: string; type: "common" | "caste-denial" }[] = [];

        if (commonRes && commonRes.ok) {
          const commonData = await commonRes.json();
          if (Array.isArray(commonData)) {
            commonData.forEach((q: any) => {
              extras.push({ id: q.id, question: q.question, type: "common" });
            });
          }
        }

        if (casteRes && casteRes.ok) {
          const casteData = await casteRes.json();
          if (Array.isArray(casteData)) {
            casteData.forEach((q: any) => {
              extras.push({ id: q.id, question: q.question, type: "caste-denial" });
            });
          }
        }

        setLiveQuestions(extras);
      } catch (e) {
        // Fall back gracefully to precompiled questions
      }
    };

    fetchExtraQuestions();
  }, [isAdmin]);

  // Debounce search query by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  // Perform search whenever debounced query or active language changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const matched = searchQuestions(debouncedQuery, activeLang, liveQuestions);
    setResults(matched);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [debouncedQuery, activeLang, liveQuestions]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        setIsOpen(true);
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

  // Highlight matched substring if present
  const highlightMatch = (text: string, sub: string) => {
    if (!sub.trim()) return text;
    const parts = text.split(new RegExp(`(${sub.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === sub.toLowerCase() ? (
            <mark key={i} className="bg-amber-200 text-slate-900 font-semibold rounded px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#fce4ec] to-[#f8bbd0] border-b border-pink-200 shadow-sm py-2 px-4 transition-all">
      <div ref={containerRef} className="max-w-3xl mx-auto relative">
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
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDERS[activeLang] || PLACEHOLDERS.ta}
            aria-label={SEARCH_LABEL[activeLang]}
            className="w-full pl-11 pr-10 py-2.5 bg-white text-slate-800 placeholder-slate-400 text-sm md:text-base rounded-full border border-pink-300 focus:outline-none focus:ring-2 focus:ring-[#c2185b] focus:border-transparent shadow-inner transition-all"
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full focus:outline-none"
              title="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Matched Questions Dropdown Rendered Below */}
        {isOpen && query.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-pink-200 overflow-hidden z-50 max-h-[72vh] flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header / Matches counter */}
            <div className="bg-[#fdf2f8] px-4 py-2 border-b border-pink-100 flex items-center justify-between text-xs font-semibold text-[#ad1457]">
              <span>
                {results.length > 0
                  ? `${results.length} ${
                      results.length === 1 ? "question matched" : "questions matched"
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
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                            item.type === "common"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-pink-100 text-[#ad1457] border border-pink-200"
                          }`}
                        >
                          {item.categoryLabel}
                        </span>

                        {item.matchedInLang && item.matchedInLang !== activeLang && item.matchedInLang !== "keywords" && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            (matched via {item.matchedInLang.toUpperCase()})
                          </span>
                        )}
                      </div>

                      <div className="text-sm md:text-base font-medium leading-snug">
                        {highlightMatch(item.displayQuestion, debouncedQuery)}
                      </div>

                      {/* If the matched text is in a different language than displayed, show a helpful snippet */}
                      {item.matchedText &&
                        item.matchedText !== item.displayQuestion &&
                        item.matchedText.toLowerCase().includes(debouncedQuery.toLowerCase()) && (
                          <div className="text-xs text-slate-500 italic flex items-center gap-1">
                            <span>Matched:</span>
                            <span>{highlightMatch(item.matchedText, debouncedQuery)}</span>
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
