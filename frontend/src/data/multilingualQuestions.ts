import { staticAnswers } from "@/data/answers";
import { multilingualAnswers } from "@/data/multilingualAnswers";

export interface MultilingualQuestion {
  id: number;
  type: 'common' | 'caste-denial';
  path: string;
  translations: {
    ta: string;
    en: string;
    ml: string;
    kn: string;
    te: string;
    hi: string;
  };
  keywords: string;
}

export const CATEGORY_LABELS: Record<
  'common' | 'caste-denial',
  Record<'ta' | 'en' | 'ml' | 'kn' | 'te' | 'hi', string>
> = {
  common: {
    ta: 'பொதுவான கேள்வி',
    en: 'Common Question',
    ml: 'പൊതുവായ ചോദ്യം',
    kn: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆ',
    te: 'సాధారణ ప్రశ్న',
    hi: 'सामान्य प्रश्न'
  },
  'caste-denial': {
    ta: 'சாதி மறுப்பு Q & A',
    en: 'Caste Denial Q & A',
    ml: 'ജാതി നിഷേധ ചോദ്യോത്തരം',
    kn: 'ಜಾತಿ ನಿರಾಕರಣೆ ಪ್ರಶ್ನೋತ್ತರ',
    te: 'కుల వ్యతిరేక ప్రశ్నోత్తరాలు',
    hi: 'जाति-निषेध प्रश्नोत्तरी'
  }
};

export const MULTILINGUAL_QUESTIONS: MultilingualQuestion[] = [
  // --- Common Questions (1 to 10) ---
  {
    id: 1,
    type: 'common',
    path: '/common-qa/1',
    translations: {
      ta: '1) இயேசு ஒரு சாதாரண மனிதன்தானே!',
      en: "1) Jesus is just an ordinary man, isn't he!",
      ml: '1) യേശു ഒരു സാധാരണ മനുഷ്യനല്ലേ!',
      kn: '1) ಯೇಸು ಒಬ್ಬ ಸಾಮಾನ್ಯ ಮನುಷ್ಯನಷ್ಟೇ ಅಲ್ಲವೇ!',
      te: '1) యేసు ఒక సాధారణ మనిషే కదా!',
      hi: '1) यीशु केवल एक साधारण मनुष्य ही तो हैं!'
    },
    keywords: 'yesu jesus sadharana manithan man ordinary human avatar devan normal manushya'
  },
  {
    id: 2,
    type: 'common',
    path: '/common-qa/2',
    translations: {
      ta: '2) இயேசு தெய்வம் என்று பைபிளில் எழுதப்பட்டுள்ளதா ?',
      en: '2) Is it written in the Bible that Jesus is God?',
      ml: '2) യേശു ദൈവമാണെന്ന് ബൈബിളിൽ എഴുതിയിട്ടുണ്ടോ?',
      kn: '2) ಯೇಸು ದೇವರಾಗಿದ್ದಾನೆ ಎಂದು ಬೈಬಲ್‌ನಲ್ಲಿ ಬರೆಯಲಾಗಿದೆಯೇ?',
      te: '2) యేసు దేవుడని బైబిల్లో రాయబడి ఉందా?',
      hi: '2) क्या बाइबल में लिखा है कि यीशु ईश्वर हैं?'
    },
    keywords: 'yesu deivam bible ezhuthappattullatha god scripture kartha bhagavan devudu bhagavanthudu devan'
  },
  {
    id: 3,
    type: 'common',
    path: '/common-qa/3',
    translations: {
      ta: '3) இயேசு தன்னைத்தான் தெய்வமென்று கூறினாரா ?',
      en: '3) Did Jesus claim Himself to be God?',
      ml: '3) യേശു തന്നെത്തന്നെ ദൈവമെന്ന് പറഞ്ഞിട്ടുണ്ടോ?',
      kn: '3) ಯೇಸು ತನ್ನನ್ನು ತಾನೇ ದೇವರೆಂದು ಹೇಳಿಕೊಂಡಿದ್ದಾನೆಯೇ?',
      te: '3) యేసు తనను తాను దేవుడని చెప్పుకున్నాడా?',
      hi: '3) क्या यीशु ने स्वयं को ईश्वर कहा था?'
    },
    keywords: 'yesu thannaithaan claim god deivam sonnara koodinara paranjittundo swayam bhagavan'
  },
  {
    id: 4,
    type: 'common',
    path: '/common-qa/4',
    translations: {
      ta: '4) இயேசுவை யாராவது தொழுததாக வேதத்தில் ஆதாரமுண்டா ?',
      en: '4) Is there evidence in the scriptures that anyone worshipped Jesus?',
      ml: '4) യേശുവിനെ ആരെങ്കിലും ആരാധിച്ചതായി തിരുവെഴുത്തുകളിൽ തെളിവുണ്ടോ?',
      kn: '4) ಯಾರಾದರೂ ಯೇಸುವನ್ನು ಆರಾಧಿಸಿದ ಬಗ್ಗೆ ಶಾಸ್ತ್ರದಲ್ಲಿ ಪುರಾವೆ ಇದೆಯೇ?',
      te: '4) ఎవరైనా యేసును పూజించినట్లు లేదా ఆరాధించినట్లు లేఖనాల్లో రుజువు ఉందా?',
      hi: '4) क्या शास्त्रों में कोई प्रमाण है कि किसी ने यीशु की आराधना की थी?'
    },
    keywords: 'worship thozhuthathaga aarathithathu vanangiyathu aradhana thozhudhar evidence vedhathil aadharam poojinchadam'
  },
  {
    id: 5,
    type: 'common',
    path: '/common-qa/5',
    translations: {
      ta: '5) இயேசு தெய்வமானால் அவரை எப்படி கொன்றுவிட முடியும் ?',
      en: '5) If Jesus is God, how could He be killed?',
      ml: '5) യേശു ദൈവമാണെങ്കിൽ അവിടുത്തെ എങ്ങനെ കൊല്ലാൻ കഴിയും?',
      kn: '5) ಯೇಸು ದೇವರಾಗಿದ್ದರೆ ಆತನನ್ನು ಹೇಗೆ ಕೊಲ್ಲಲು ಸಾಧ್ಯ?',
      te: '5) యేసు దేవుడైతే ఆయనను ఎలా చంపగలరు?',
      hi: '5) यदि यीशु ईश्वर हैं, तो उन्हें कैसे मारा जा सकता है?'
    },
    keywords: 'killed murder crucify siluvai kolla mudiyum maranam saavu death devananaal god die champadam'
  },
  {
    id: 6,
    type: 'common',
    path: '/common-qa/6',
    translations: {
      ta: '6) மனிதர்கள் தவறு செய்திருக்க, நிரபராதி இயேசு கொல்லப்பட்டது நியாயமா ?',
      en: '6) When humans sinned, is it fair that the innocent Jesus was killed?',
      ml: '6) മനുഷ്യർ തെറ്റ് ചെയ്തപ്പോൾ, നിരപരാധിയായ യേശു കൊല്ലപ്പെട്ടത് ന്യായമാണോ?',
      kn: '6) ಮಾನವರು ತಪ್ಪು ಮಾಡಿದಾಗ, ನಿರಪರಾಧಿ ಯೇಸುವನ್ನು ಕೊಂದದ್ದು ನ್ಯಾಯವೇ?',
      te: '6) మనుషులు తప్పు చేసినప్పుడు, నిరపరాధియైన యేసు చంపబడటం న్యాయమా?',
      hi: '6) जब पाप मनुष्यों ने किया, तो निर्दोष यीशु का मारा जाना क्या न्यायसंगत है?'
    },
    keywords: 'innocent niraparathi thavaru sin humans manithargal nyayama fair justice siluvai maranam thetto thet'
  },
  {
    id: 7,
    type: 'common',
    path: '/common-qa/7',
    translations: {
      ta: '7) இயேசுவால் நோய்களை குணப்படுத்த முடியுமானால், கிறிஸ்தவர்கள் மருத்துவமனைகள் தொடங்க வேண்டிய தேவை இல்லையே ?',
      en: '7) If Jesus could heal diseases, why do Christians need to start hospitals?',
      ml: '7) യേശുവിന് രോഗങ്ങൾ സുഖപ്പെടുത്താൻ കഴിയുമെങ്കിൽ, ക്രിസ്ത്യാനികൾ ആശുപത്രികൾ ആരംഭിക്കേണ്ട ആവശ്യമില്ലല്ലോ?',
      kn: '7) ಯೇಸುವಿನಿಂದ ರೋಗಗಳನ್ನು ಗುಣಪಡಿಸಲು ಸಾಧ್ಯವಿದ್ದರೆ, ಕ್ರೈಸ್ತರು ಆಸ್ಪತ್ರೆಗಳನ್ನು ತೆರೆಯುವ ಅಗತ್ಯವಿಲ್ಲವಲ್ಲ?',
      te: '7) యేసు రోగాలను నయం చేయగలిగితే, క్రైస్తవులు ఆసుపత్రులు ప్రారంభించాల్సిన అవసరం లేదు కదా?',
      hi: '7) यदि यीशु बीमारियों को ठीक कर सकते हैं, तो ईसाइयों को अस्पताल खोलने की क्या आवश्यकता है?'
    },
    keywords: 'hospital maruthuvamanai gunapadutha heal disease noigal sickness arogyam maruthuvam rogagalu rogam asupatri aaspathre'
  },
  {
    id: 8,
    type: 'common',
    path: '/common-qa/8',
    translations: {
      ta: '8) இயேசு இன்றும் உயிரோடிருக்கிறார் என்று எப்படி சொல்கிறீர்கள் ?',
      en: '8) How do you say that Jesus is alive today?',
      ml: '8) യേശു ഇന്നും ജീവനോടെയിരിക്കുന്നു എന്ന് നിങ്ങൾ എങ്ങനെ പറയുന്നു?',
      kn: '8) ಯೇಸು ಇಂದಿಗೂ ಜೀವಂತವಾಗಿದ್ದಾರೆ ಎಂದು ನೀವು ಹೇಗೆ ಹೇಳುತ್ತೀರಿ?',
      te: '8) యేసు నేటికీ సజీవంగా ఉన్నారని మీరు ఎలా చెబుతారు?',
      hi: '8) आप कैसे कहते हैं कि यीशु आज भी जीवित हैं?'
    },
    keywords: 'alive uyirodirukirar resurrection uyirthezhunthar living jeevan jeevanodeyiddare sajeevam jeevanodu'
  },
  {
    id: 9,
    type: 'common',
    path: '/common-qa/9',
    translations: {
      ta: '9) பரலோகத்திற்கு போகும் ஒரே வழி இயேசுவானால், இயேசுவுக்குமுன் இறந்தோரும், அவரைத் தெரியாமல் இறப்போரும் எங்கே போவார்கள் ?',
      en: '9) If Jesus is the only way to heaven, where do those who died before Him or without knowing Him go?',
      ml: '9) സ്വർഗ്ഗത്തിലേക്കുള്ള ഏക വഴി യേശുവാണെങ്കിൽ, യേശുവിന് മുമ്പ് മരിച്ചവരും അവിടുത്തെ അറിയാതെ മരിച്ചവരും എവിടെ പോകും?',
      kn: '9) ಪರಲೋಕಕ್ಕೆ ಹೋಗುವ ಏಕೈಕ ಮಾರ್ಗ ಯೇಸುವಾಗಿದ್ದರೆ, ಯೇಸುವಿಗಿಂತ ಮುಂಚೆ ಸತ್ತವರು ಮತ್ತು ಆತನನ್ನು ತಿಳಿಯದೆ ಸತ್ತವರು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಾರೆ?',
      te: '9) పరలోకానికి వెళ్ళే ఏకైక మార్గం యేసే అయితే, యేసుకు ముందు చనిపోయినవారు, ఆయన గురించి తెలియక చనిపోయినవారు ఎక్కడికి వెళతారు?',
      hi: '9) यदि स्वर्ग जाने का एकमात्र मार्ग यीशु हैं, तो जो लोग उनसे पहले मरे या उन्हें जाने बिना मरे वे कहाँ जाएँगे?'
    },
    keywords: 'heaven paralogam sorgam afterlife died before salvation ratchippu vazhi way munniranthoar swargam swarga paralokam'
  },
  {
    id: 10,
    type: 'common',
    path: '/common-qa/10',
    translations: {
      ta: '10) கிறிஸ்து கிறிஸ்தவர்களுக்கு மட்டுமே உரியவர்.',
      en: '10) Christ belongs only to Christians.',
      ml: '10) ക്രിസ്തു ക്രിസ്ത്യാനികൾക്ക് മാത്രമുള്ളയാളാണ്.',
      kn: '10) ಕ್ರಿಸ್ತನು ಕ್ರೈಸ್ತರಿಗೆ ಮಾತ್ರ ಸೇರಿದವನು.',
      te: '10) క్రీస్తు క్రైస్తవులకు మాత్రమే చెందినవాడు.',
      hi: '10) मसीह केवल ईसाइयों के हैं।'
    },
    keywords: 'christ only christians uriyavar belong mattrumae matham religion anaivarukkum all matrame'
  },

  // --- Caste Denial Q & A (1 to 25) ---
  {
    id: 1,
    type: 'caste-denial',
    path: '/caste-denial-qa/1',
    translations: {
      ta: '1) கிறிஸ்தவர்களுக்குள் சாதியே இல்லையே! இல்லாத சாதியை எப்படி ஒழிப்பீர்கள்?',
      en: "1) There is no caste among Christians at all! How can you eradicate a caste that doesn't exist?",
      ml: '1) ക്രിസ്ത്യാനികൾക്കിടയിൽ ജാതിയില്ലല്ലോ! ഇല്ലാത്ത ജാതിയെ നിങ്ങൾ എങ്ങനെ ഉന്മൂലനം ചെയ്യും?',
      kn: '1) ಕ್ರೈಸ್ತರಲ್ಲಿ ಜಾತಿಯೇ ಇಲ್ಲವಲ್ಲ! ಇಲ್ಲದ ಜಾತಿಯನ್ನು ನೀವು ಹೇಗೆ ನಿರ್ಮೂಲನೆ ಮಾಡುತ್ತೀರಿ?',
      te: '1) క్రైస్తవులలో కులమే లేదు కదా! లేని కులాన్ని మీరు ఎలా నిర్మూలిస్తారు?',
      hi: '1) ईसाइयों में तो जाति ही नहीं है! जो जाति है ही नहीं उसे आप कैसे मिटाएँगे?'
    },
    keywords: 'no caste illatha saathi ozhippirgal eradicate casteism jaathi kulam jaathiyilla kulamledu'
  },
  {
    id: 2,
    type: 'caste-denial',
    path: '/caste-denial-qa/2',
    translations: {
      ta: '2) சாதியம் பெரிய பாவமா?',
      en: '2) Is casteism a big sin?',
      ml: '2) ജാതീയത ഒരു വലിയ പാപമാണോ?',
      kn: '2) ಜಾತೀಯತೆಯು ದೊಡ್ಡ ಪಾಪವೇ?',
      te: '2) కులతత్వం పెద్ద పాపమా?',
      hi: '2) क्या जातिवाद एक बड़ा पाप है?'
    },
    keywords: 'sin paavam periya paavam casteism jaatheeyatha kula thathvam paapama paapa paap'
  },
  {
    id: 3,
    type: 'caste-denial',
    path: '/caste-denial-qa/3',
    translations: {
      ta: '3) கடவுள் படைக்கும்போது ஜாதி ஜாதியாகப் படைத்தார் என்று வேதம் கூறுகிறதே!',
      en: '3) The Bible says God created species/kinds when He created!',
      ml: '3) ദൈവം സൃഷ്ടിച്ചപ്പോൾ ജാതിജാതിയായി സൃഷ്ടിച്ചു എന്ന് തിരുവെഴുത്തുകൾ പറയുന്നുണ്ടല്ലോ!',
      kn: '3) ದೇವರು ಸೃಷ್ಟಿಸುವಾಗ ಜಾತಿ ಜಾತಿಯಾಗಿ ಸೃಷ್ಟಿಸಿದನು ಎಂದು ವೇದವು ಹೇಳುತ್ತದಲ್ಲವೇ!',
      te: '3) దేవుడు సృష్టించినప్పుడు జాతుల వారీగా సృష్టించాడని బైబిల్ చెబుతోంది కదా!',
      hi: '3) बाइबल कहती है कि ईश्वर ने सृष्टि के समय जाति-जाति (प्रजातियों) के अनुसार बनाया!'
    },
    keywords: 'creation padaithar jaathi jaathiyaga kinds species genesis aaghamam srishti padaipu jaatulu'
  },
  {
    id: 4,
    type: 'caste-denial',
    path: '/caste-denial-qa/4',
    translations: {
      ta: '4) மொழி அடிப்படையில் வெவ்வேறு சபைகள் தனித்தனியாக இருப்பதுபோல, சாதி அடிப்படையில் சபைகள் தனித்தனியாக இருப்பதில் என்ன தவறு இருக்கிறது?',
      en: '4) Just as churches exist separately based on language, what is wrong with having separate churches based on caste?',
      ml: '4) ഭാഷയുടെ അടിസ്ഥാനത്തിൽ വ്യത്യസ്ത സഭകൾ ഉള്ളതുപോലെ, ജാതിയുടെ അടിസ്ഥാനത്തിൽ സഭകൾ വെവ്വേറെയാകുന്നതിൽ എന്താണ് തെറ്റ്?',
      kn: '4) ಭಾಷೆಯ ಆಧಾರದ ಮೇಲೆ ಬೇರೆ ಬೇರೆ ಸಭೆಗಳು ಪ್ರತ್ಯೇಕವಾಗಿರುವಂತೆ, ಜಾತಿಯ ಆಧಾರದ ಮೇಲೆ ಸಭೆಗಳು ಇರುವುದರಲ್ಲಿ ತಪ್ಪೇನು?',
      te: '4) భాష ఆధారంగా వేర్వేరు సంఘాలు ప్రత్యేకంగా ఉన్నట్లే, కులం ఆధారంగా సంఘాలు ప్రత్యేకంగా ఉండటంలో తప్పేముంది?',
      hi: '4) जैसे भाषा के आधार पर अलग-अलग मंडलियाँ होती हैं, वैसे जाति के आधार पर मंडलियाँ होने में क्या बुराई है?'
    },
    keywords: 'language churches mozhi sabai church denominations thavaru separate tharithani bhasha sangham sabhe'
  },
  {
    id: 5,
    type: 'caste-denial',
    path: '/caste-denial-qa/5',
    translations: {
      ta: '5) பாபேலில் பாஷைகளை பிரித்ததே கடவுள் அல்லவா! அப்படியானால் சாதிப் பிரிவுகள் தவறு என்று எப்படி சொல்கிறீர்கள்?',
      en: "5) Wasn't it God who divided languages at Babel! Then how do you say caste divisions are wrong?",
      ml: '5) ബാബേലിൽ ഭാഷകളെ വേർതിരിച്ചത് ദൈവമല്ലേ! അങ്ങനെയെങ്കിൽ ജാതിവിഭാഗങ്ങൾ തെറ്റാണെന്ന് നിങ്ങൾ എങ്ങനെ പറയുന്നു?',
      kn: '5) ಬಾಬೆಲ್‌ನಲ್ಲಿ ಭಾಷೆಗಳನ್ನು ಬೇರ್ಪಡಿಸಿದ್ದು ದೇವರಲ್ಲವೇ! ಹಾಗಿರುವಾಗ ಜಾತಿ ವಿಭಾಗಗಳು ತಪ್ಪೆಂದು ಹೇಗೆ ಹೇಳುತ್ತೀರಿ?',
      te: '5) బాబెలు గోపురంలో భాషలను విభజించింది దేవుడే కదా! అలాంటప్పుడు కుల విభజనలు తప్పని ఎలా చెబుతారు?',
      hi: '5) बाबेल में भाषाओं को अलग करने वाले परमेश्वर ही तो थे! तो आप जातिगत विभाजन को गलत कैसे कह सकते हैं?'
    },
    keywords: 'babel tower babelil baashai languages divide pirithathu wrong thavaru bhashalu vibhajana'
  },
  {
    id: 6,
    type: 'caste-denial',
    path: '/caste-denial-qa/6',
    translations: {
      ta: '6) தொழில் அடிப்படையில் ஜாதி பிரிந்திருப்பதில் என்ன தவறு இருக்கிறது?',
      en: '6) What is wrong with caste divisions based on occupation or profession?',
      ml: '6) തൊഴിലിന്റെ അടിസ്ഥാനത്തിൽ ജാതി വിഭജിക്കപ്പെടുന്നതിൽ എന്താണ് തെറ്റ്?',
      kn: '6) ಉದ್ಯೋಗ ಅಥವಾ ವೃತ್ತಿಯ ಆಧಾರದ ಮೇಲೆ ಜಾತಿ ವಿಭಜನೆಯಾಗುವುದರಲ್ಲಿ ತಪ್ಪೇನು?',
      te: '6) వృత్తి లేదా ఉద్యోగం ఆధారంగా కులం విభజించబడటంలో తప్పేముంది?',
      hi: '6) व्यवसाय या पेशे के आधार पर जाति बँटने में क्या खराबी है?'
    },
    keywords: 'profession occupation thozhil profession vruthi work division udyogam thozhilil'
  },
  {
    id: 7,
    type: 'caste-denial',
    path: '/caste-denial-qa/7',
    translations: {
      ta: '7) ஏழை-பணக்காரர், படித்தவர்-பாமரர் என்ற பாகுபாடுகள் சபையிலுண்டே!',
      en: '7) There are discriminations like rich-poor, educated-uneducated in the church!',
      ml: '7) പണക്കാരൻ-പാവപ്പെട്ടവൻ, വിദ്യാസമ്പന്നൻ-നിരക്ഷരൻ തുടങ്ങിയ വിവേചനങ്ങൾ സഭയിലുണ്ടല്ലോ!',
      kn: '7) ಬಡವ-ಶ್ರೀಮಂತ, ಕಲಿತವನು-ಕಲಿಯದವನು ಎಂಬ ತಾರತಮ್ಯಗಳು ಸಭೆಯಲ್ಲಿದೆಯಲ್ಲವೇ!',
      te: '7) పేద-ధనిక, చదువుకున్నవారు-చదువుకోనివారు అనే వివక్షలు సంఘంలో ఉన్నాయి కదా!',
      hi: '7) अमीर-गरीब, पढ़े-लिखे और अनपढ़ का भेदभाव भी तो कलीसिया में होता है!'
    },
    keywords: 'rich poor ezhai panakkarar padithavar uneducated discrimination pagupaadu tharatamya vivaksha bedhabhed'
  },
  {
    id: 8,
    type: 'caste-denial',
    path: '/caste-denial-qa/8',
    translations: {
      ta: '8) ஆணென்றும் பெண்ணென்றுமில்லை’ (கலா. 3:28) என்று பவுல் சொல்வதால், விசுவாசிகளுக்குள் ஆணென்றும் பெண்ணென்றும் வேறுபாடே இல்லை என்று கூற முடியுமா?',
      en: "8) When Paul says 'There is neither male nor female' (Gal. 3:28), can we say there is no difference between male and female among believers?",
      ml: "8) 'ആണെന്നോ പെണ്ണെന്നോ ഇല്ല' (ഗലാ. 3:28) എന്ന് പൗലോസ് പറയുന്നതുകൊണ്ട്, വിശ്വാസികൾക്കിടയിൽ സ്ത്രീ-പുരുഷ വ്യത്യാസമില്ലെന്ന് പറയാൻ കഴിയുമോ?",
      kn: "8) 'ಗಂಡೆಂದೂ ಹೆಣ್ಣೆಂದೂ ಇಲ್ಲ' (ಗಲಾ. 3:28) ಎಂದು ಪೌಲನು ಹೇಳುವುದರಿಂದ, ವಿಶ್ವಾಸಿಗಳಲ್ಲಿ ಗಂಡು-ಹೆಣ್ಣು ಎಂಬ ವ್ಯತ್ಯಾಸವೇ ಇಲ್ಲವೆಂದು ಹೇಳಬಹುದೇ?",
      te: "8) 'పురుషుడని స్త్రీయని లేదు' (గలతీ 3:28) అని పౌలు అన్నందున, విశ్వాసులలో స్త్రీ పురుషుల మధ్య తేడాయే లేదని చెప్పగలమా?",
      hi: "8) जब पौलुस कहते हैं कि 'न कोई पुरुष रहा न स्त्री' (गलातियों 3:28), तो क्या विश्वासियों में कोई भेद नहीं है?"
    },
    keywords: 'paul galatians 3:28 aan penn male female stree purusha perbedaan veerupaadu paulu galathiyarkku'
  },
  {
    id: 9,
    type: 'caste-denial',
    path: '/caste-denial-qa/9',
    translations: {
      ta: '9) நான் யாரையும் கீழ்சாதி என்று புறக்கணிக்கவில்லை. நான் என் சாதியில் திருமணம் செய்வது எப்படி தவறாகும்? கிறிஸ்தவர்கள் அவரவர் சாதியில் திருமணம் செய்யட்டுமே! அதில் என்ன தவறு இருக்கிறது?',
      en: "9) I don't look down on anyone as lower caste. How is marrying within my own caste wrong? Let Christians marry within their caste, what is wrong with that?",
      ml: '9) ഞാൻ ആരെയും താഴ്ന്ന ജാതിയെന്ന് തള്ളിക്കളയുന്നില്ല. സ്വന്തം ജാതിയിൽ വിവാഹം ചെയ്യുന്നത് എങ്ങനെ തെറ്റാകും? ക്രിസ്ത്യാനികൾ സ്വന്തം ജാതിയിൽ വിവാഹം കഴിക്കട്ടെ, അതിൽ എന്താണ് തെറ്റ്?',
      kn: '9) ನಾನು ಯಾರನ್ನೂ ಕೀಳು ಜಾತಿ ಎಂದು ಕಡೆಗಣಿಸುವುದಿಲ್ಲ. ನನ್ನ ಸ್ವಜಾತಿಯಲ್ಲಿ ಮದುವೆಯಾಗುವುದು ಹೇಗೆ ತಪ್ಪಾಗುತ್ತದೆ? ಕ್ರೈಸ್ತರು ತಮ್ಮ ತಮ್ಮ ಜಾತಿಯಲ್ಲೇ ಮದುವೆಯಾಗಲಿ, ಅದರಲ್ಲಿ ತಪ್ಪೇನು?',
      te: '9) నేను ఎవరినీ తక్కువ కులం అని చూడటం లేదు. నా స్వంత కులంలో పెళ్లి చేసుకోవడం ఎలా తప్పవుతుంది? క్రైస్తవులు తమ తమ కులాల్లోనే పెళ్లిళ్లు చేసుకోనివ్వండి, దాంట్లో తప్పేముంది?',
      hi: '9) मैं किसी को नीची जाति समझकर नहीं ठुकराता। अपनी ही जाति में विवाह करना गलत कैसे है? ईसाई अपनी जाति में विवाह करें, इसमें क्या खराबी है?'
    },
    keywords: 'marriage thirumanam kalyanam vivaham maduve pelli swasathi own caste keezhsathi endogamy purakkanikkavillai'
  },
  {
    id: 10,
    type: 'caste-denial',
    path: '/caste-denial-qa/10',
    translations: {
      ta: '10) கலப்புத் திருமணம் செய்யச் சொல்கிறீர்களா?',
      en: '10) Are you telling us to do inter-caste marriage?',
      ml: '10) നിങ്ങൾ മിശ്രവിവാഹം കഴിക്കാനാണോ പറയുന്നത്?',
      kn: '10) ನೀವು ಅಂತರ್ಜಾತಿ ವಿವಾಹವಾಗಲು ಹೇಳುತ್ತಿದ್ದೀರಾ?',
      te: '10) మీరు కులాంతర వివాహం చేసుకోమంటున్నారా?',
      hi: '10) क्या आप अंतरजातीय विवाह करने के लिए कह रहे हैं?'
    },
    keywords: 'intercaste inter-caste marriage kalappu thirumanam mishravivaham antharjaathi kulantara vivaham mixed marriage'
  },
  {
    id: 11,
    type: 'caste-denial',
    path: '/caste-denial-qa/11',
    translations: {
      ta: '11) ஆபிரகாம் தன் மகன் ஈசாக்குக்கு பெண் பார்க்கும்போது தன் சொந்த இனத்தாரிடத்தில் பெண் பார்க்க சொன்னாரே!',
      en: '11) Abraham told to seek a bride for his son Isaac from among his own kindred!',
      ml: '11) അബ്രാഹാം തന്റെ മകൻ യിസ്ഹാക്കിന് വധുവിനെ അന്വേഷിച്ചപ്പോൾ സ്വന്തം ചാർച്ചക്കാരിൽ നിന്ന് കണ്ടെത്താനാണല്ലോ പറഞ്ഞത്!',
      kn: '11) ಅಬ್ರಹಾಮನು ತನ್ನ ಮಗ ಇಸಾಕನಿಗೆ ಹೆಣ್ಣು ಹುಡುಕುವಾಗ ತನ್ನ ಸ್ವಂತ ಜನರಿಂದ ಹುಡುಕಲು ಹೇಳಿದನಲ್ಲವೇ!',
      te: '11) అబ్రాహాము తన కుమారుడైన ఇస్సాకుకు పెళ్లి సంబంధం చూసేటప్పుడు తన స్వంత బంధువులలో చూడమన్నాడు కదా!',
      hi: '11) इब्राहीम ने अपने बेटे इसहाक के लिए अपनी ही जाति और कुटुम्बियों में से पत्नी ढूँढने को कहा था!'
    },
    keywords: 'abraham isaac kindred son bride aabiraham eesakku inam relatives sontha inam yisaak'
  },
  {
    id: 12,
    type: 'caste-denial',
    path: '/caste-denial-qa/12',
    translations: {
      ta: '12) கடவுள் இஸ்ரயேல் மக்களை சிறப்பாக நேசித்தாரே! சாதி இல்லை என்று எப்படி சொல்கிறீர்கள்?',
      en: '12) God loved the people of Israel specifically! How do you say there is no caste?',
      ml: '12) ദൈവം ഇസ്രായേൽ ജനതയെ പ്രത്യേകമായി സ്നേഹിച്ചുവല്ലോ! ജാതിയില്ലെന്ന് എങ്ങനെ പറയുന്നു?',
      kn: '12) ದೇವರು ಇಸ್ರಾಯೇಲ್ ಜನರನ್ನು ವಿಶೇಷವಾಗಿ ಪ್ರೀತಿಸಿದನಲ್ಲವೇ! ಜಾತಿಯಿಲ್ಲ ಎಂದು ಹೇಗೆ ಹೇಳುತ್ತೀರಿ?',
      te: '12) దేవుడు ఇశ్రాయేలు ప్రజలను ప్రత్యేకంగా ప్రేమించాడు కదా! కులం లేదని ఎలా చెబుతారు?',
      hi: '12) परमेश्वर ने इस्राएल के लोगों से विशेष प्रेम किया था! फिर आप कैसे कहते हैं कि जाति नहीं है?'
    },
    keywords: 'israel israeyal chosen people special love kadavul nesithar israelites jaathi kulam'
  },
  {
    id: 13,
    type: 'caste-denial',
    path: '/caste-denial-qa/13',
    translations: {
      ta: '13) விவிலிய கடவுள் யூதர் அல்லாதவரை வெறுத்தவர் அல்லவா!',
      en: "13) Didn't the biblical God hate non-Jews (Gentiles)?",
      ml: '13) ബൈബിളിലെ ദൈവം യഹൂദരല്ലാത്തവരെ വെറുത്തവനല്ലേ!',
      kn: '13) ಬೈಬಲ್‌ನ ದೇವರು ಯಹೂದ್ಯರಲ್ಲದವರನ್ನು ದ್ವೇಷಿಸಿದವನಲ್ಲವೇ!',
      te: '13) బైబిల్ దేవుడు యూదులు కానివారిని ద్వేషించాడు కదా!',
      hi: '13) क्या बाइबल के परमेश्वर गैर-यहूदियों से घृणा करते थे?'
    },
    keywords: 'jews gentiles non-jews yuthar veruthavar hate bibiliya kadavul yahoothar dheshinchadam'
  },
  {
    id: 14,
    type: 'caste-denial',
    path: '/caste-denial-qa/14',
    translations: {
      ta: '14) இஸ்ரயேலர்கள் 12 குலங்களாக பிரிந்திருந்தார்கள். ஒரு குலத்தை சார்ந்தவர் பிற குலத்தை சார்ந்தவரை திருமணம் செய்யக்கூடாது என்று கடவுள் சொன்னாரே!',
      en: '14) The Israelites were divided into 12 tribes. God said that a person belonging to one tribe should not marry someone from another tribe!',
      ml: '14) ഇസ്രായേല്യർ 12 ഗോത്രങ്ങളായി തിരിഞ്ഞിരുന്നു. ഒരു ഗോത്രത്തിലുള്ളവർ മറ്റൊരു ഗോത്രത്തിലുള്ളവരെ വിവാഹം കഴിക്കരുതെന്ന് ദൈവം പറഞ്ഞിട്ടുണ്ടല്ലോ!',
      kn: '14) ಇಸ್ರಾಯೇಲ್ಯರು 12 ಕುಲಗಳಾಗಿ ವಿಂಗಡಿಸಲ್ಪಟ್ಟಿದ್ದರು. ಒಂದು ಕುಲದವರು ಇನ್ನೊಂದು ಕುಲದವರನ್ನು ಮದುವೆಯಾಗಬಾರದು ಎಂದು ದೇವರು ಹೇಳಿದನಲ್ಲವೇ!',
      te: '14) ఇశ్రాయేలీయులు 12 గోత్రాలుగా విభజించబడ్డారు. ఒక గోత్రం వారు మరొక గోత్రం వారిని పెళ్లి చేసుకోకూడదని దేవుడు చెప్పాడు కదా!',
      hi: '14) इस्राएली 12 गोत्रों में विभाजित थे। परमेश्वर ने कहा था कि एक गोत्र का व्यक्ति दूसरे गोत्र में विवाह न करे!'
    },
    keywords: '12 tribes kulangal gothram gothralu israelites 12 kulam marriage thirumanam gotra'
  },
  {
    id: 15,
    type: 'caste-denial',
    path: '/caste-denial-qa/15',
    translations: {
      ta: '15) லேவி குலத்தார் மட்டுமே தனக்கு ஊழியம் செய்யவேண்டும் (உபா.10:8) என்று கடவுள் கட்டளையிட்டாரே!',
      en: '15) God commanded that only the tribe of Levi should minister before Him (Deut. 10:8)!',
      ml: '15) ലേവി ഗോത്രം മാത്രമേ തനിക്ക് ശുശ്രൂഷ ചെയ്യണമെന്ന് ദൈവം കൽപ്പിച്ചുവല്ലോ (ആവ. 10:8)!',
      kn: '15) ಲೇವಿಯ ಕುಲದವರು ಮಾತ್ರವೇ ತನಗೆ ಸೇವೆ ಮಾಡಬೇಕೆಂದು ದೇವರು ಆಜ್ಞಾಪಿಸಿದನಲ್ಲವೇ (ಧರ್ಮೋ. 10:8)!',
      te: '15) లేవీ గోత్రం మాత్రమే తనకు పరిచర్య చేయాలని దేవుడు ఆజ్ఞాపించాడు కదా (ద్వితీ. 10:8)!',
      hi: '15) परमेश्वर ने आज्ञा दी थी कि केवल लेवी गोत्र ही उनकी सेवा करे (व्यवस्थाविवरण 10:8)!'
    },
    keywords: 'levi tribe levite ooliyam ministry deut 10:8 upaagamam sevai paricharya levee'
  },
  {
    id: 16,
    type: 'caste-denial',
    path: '/caste-denial-qa/16',
    translations: {
      ta: '16) நான் பிரிவினையை உண்டுபண்ண வந்தேன்” (மத். 10:34,35) என்று இயேசுவே கூறினாரே! அப்படியானால் சாதிப் பிரிவினைகளால் என்ன தவறு?',
      en: "16) Jesus Himself said, 'I came not to bring peace, but a sword / division' (Matt. 10:34-35)! Then what is wrong with caste divisions?",
      ml: "16) 'ഞാൻ ഭിന്നതയുണ്ടാക്കാനാണ് വന്നത്' (മത്താ. 10:34,35) എന്ന് യേശു തന്നെ പറഞ്ഞുവല്ലോ! അങ്ങനെയെങ്കിൽ ജാതിവിഭജനങ്ങളിൽ എന്താണ് തെറ്റ്?",
      kn: "16) 'ನಾನು ವಿಭಾಗವನ್ನು ಉಂಟುಮಾಡಲು ಬಂದೆನು' (ಮತ್ತಾ. 10:34,35) ಎಂದು ಯೇಸುವೇ ಹೇಳಿದನಲ್ಲವೇ! ಹಾಗಿರುವಾಗ ಜಾತಿ ವಿಭಾಗಗಳಿಂದ ಏನು ತಪ್ಪು?",
      te: "16) 'నేను సమాధానాన్ని కాదు, విభజనను లేదా ఖడ్గాన్ని తేవడానికే వచ్చాను' (మత్తయి 10:34,35) అని యేసే చెప్పారు కదా! మరి కుల విభజనలలో తప్పేముంది?",
      hi: "16) यीशु ने स्वयं कहा था, 'मैं मिलाप कराने नहीं, बल्कि तलवार / बँटवारा कराने आया हूँ' (मत्ती 10:34,35)! फिर जातिगत विभाजन में क्या गलत है?"
    },
    keywords: 'division pirivinai sword matthew 10:34 madha yesu yesuve sonnare bhinnatha khadgam'
  },
  {
    id: 17,
    type: 'caste-denial',
    path: '/caste-denial-qa/17',
    translations: {
      ta: '17) இயேசு கிறிஸ்து கானானியப் பெண்மணியை நாய்க்குட்டி என்று அழைத்தாரே!',
      en: '17) Jesus Christ called the Canaanite woman a dog / little dog!',
      ml: '17) യേശുക്രിസ്തു കനാന്യ സ്ത്രീയെ നായ്ക്കുട്ടി എന്ന് വിളിച്ചുവല്ലോ!',
      kn: '17) ಯೇಸು ಕ್ರಿಸ್ತನು ಕಾನಾನ್ಯ ಸ್ತ್ರೀಯನ್ನು ನಾಯಿಮರಿ ಎಂದು ಕರೆದನಲ್ಲವೇ!',
      te: '17) యేసు క్రీస్తు కనాను స్త్రీని కుక్కపిల్ల అని పిలిచాడు కదా!',
      hi: '17) यीशु मसीह ने कनानी स्त्री को कुत्ते का बच्चा कहा था!'
    },
    keywords: 'canaanite woman puppy dog naykkutti nayi kukka kanaan kanaanian stree kukkada'
  },
  {
    id: 18,
    type: 'caste-denial',
    path: '/caste-denial-qa/18',
    translations: {
      ta: '18) இயேசு கிறிஸ்துவின் பன்னிரெண்டு திருத்தூதர்களில் யாருமே யூதர் அல்லாதவர் இல்லையே! ஆக, கிறிஸ்துவும் இன உணர்வு உடையவர்தானே!',
      en: "18) None of the twelve apostles of Jesus Christ was a non-Jew! So wasn't Christ also race-conscious?",
      ml: '18) യേശുക്രിസ്തുവിന്റെ പന്ത്രണ്ട് അപ്പോസ്തലന്മാരിൽ ആരും യഹൂദരല്ലാത്തവരായിരുന്നില്ലല്ലോ! അപ്പോൾ ക്രിസ്തുവിനും വംശീയബോധം ഉണ്ടായിരുന്നില്ലേ?',
      kn: '18) ಯೇಸು ಕ್ರಿಸ್ತನ ಹನ್ನೆರಡು ಅಪೊಸ್ತಲರಲ್ಲಿ ಯಾರೂ ಯಹೂದ್ಯರಲ್ಲದವರು ಇರಲಿಲ್ಲವಲ್ಲ! ಹಾಗಾದರೆ ಕ್ರಿಸ್ತನೂ ಜನಾಂಗೀಯ ಪ್ರಜ್ಞೆ ಹೊಂದಿದ್ದವನಲ್ಲವೇ?',
      te: '18) యేసు క్రీస్తు యొక్క పన్నెండు మంది అపొస్తలులలో ఎవరూ యూదులు కానివారు లేరు కదా! అంటే క్రీస్తుకు కూడా జాతి పక్షపాతం ఉన్నట్లే కదా!',
      hi: '18) यीशु मसीह के बारह प्रेरितों में से कोई भी गैर-यहूदी नहीं था! तो क्या मसीह में भी जातीय चेतना थी?'
    },
    keywords: '12 apostles disciples pannirendu thiruthoothargal apostalmar yuthar jews race race-conscious'
  },
  {
    id: 19,
    type: 'caste-denial',
    path: '/caste-denial-qa/19',
    translations: {
      ta: '19) என் வீட்டுக்குள் நீர் வர நான் தகுதியற்றவன் (மத். 8:8) என்று நூற்றுக்கு அதிபதி இயேசுவிடம் கூறினாரே! அது தீண்டாமை இல்லையா?',
      en: "19) The Centurion said to Jesus, 'I am not worthy that you should enter under my roof' (Matt. 8:8)! Isn't that untouchability?",
      ml: "19) 'അങ്ങയെന്റെ മേൽക്കൂരക്കീഴിൽ പ്രവേശിക്കാൻ ഞാൻ യോഗ്യനല്ല' (മത്താ. 8:8) എന്ന് ശതാധിപൻ യേശുവിനോട് പറഞ്ഞുവല്ലോ! അത് തൊട്ടുകൂടായ്മയല്ലേ?",
      kn: "19) 'ನೀವು ನನ್ನ ಮನೆಯೊಳಗೆ ಬರಲು ನಾನು ಯೋಗ್ಯನಲ್ಲ' (ಮತ್ತಾ. 8:8) ಎಂದು ಶತಾಧಿಪತಿಯು ಯೇಸುವಿಗೆ ಹೇಳಿದನಲ್ಲವೇ! ಅದು ಅಸ್ಪೃಶ್ಯತೆ ಅಲ್ಲವೇ?",
      te: "19) 'నీవు నా యింటిలోనికి వచ్చుటకు నేను పాత్రుడను కాను' (మత్తయి 8:8) అని శతాధిపతి యేసుతో అన్నాడు కదా! అది అంటరానితనం కాదా?",
      hi: "19) सूबेदार ने यीशु से कहा, 'हे प्रभु, मैं इस योग्य नहीं कि आप मेरी छत के नीचे आएँ' (मत्ती 8:8)! क्या यह छुआछूत नहीं है?"
    },
    keywords: 'centurion noottrukku adhipathi matthew 8:8 roof house theendaamai untouchability asprushyathe yogyanalla antarani'
  },
  {
    id: 20,
    type: 'caste-denial',
    path: '/caste-denial-qa/20',
    translations: {
      ta: '20) ‘சாதியத்திலிருந்து விடுதலை’ என்ற உலகியல் நன்மை கிடைக்கும் என்று யாரும் இயேசுவிடம் வரவேண்டாம்! பாவ மன்னிப்புக்காகவும், நித்திய ஜீவனுக்காகவும் மட்டும் வந்தால் போதும்.',
      en: "20) No one needs to come to Jesus expecting worldly benefit like 'freedom from casteism'! It is enough to come for forgiveness of sins and eternal life.",
      ml: "20) 'ജാതീയതയിൽ നിന്നുള്ള മോചനം' എന്ന ലൗകിക നേട്ടം കാംക്ഷിച്ച് ആരും യേശുവിങ്കലേക്ക് വരേണ്ടതില്ല! പാപമോചനത്തിനും നിത്യജീവനും വേണ്ടി മാത്രം വന്നാൽ മതി.",
      kn: "20) 'ಜಾತೀಯತೆಯಿಂದ ಬಿಡುಗಡೆ' ಎಂಬ ಲೌಕಿಕ ಲಾಭಕ್ಕಾಗಿ ಯಾರೂ ಯೇಸುವಿನ ಬಳಿಗೆ ಬರಬೇಕಾಗಿಲ್ಲ! ಪಾಪ ಕ್ಷಮೆ ಮತ್ತು ನಿತ್ಯ ಜೀವಕ್ಕಾಗಿ ಮಾತ್ರ ಬಂದರೆ ಸಾಕು.",
      te: "20) 'కులతత్వం నుండి విడుదల' అనే లౌకిక ప్రయోజనం కోసం ఎవరూ యేసు వద్దకు రానక్కర్లేదు! పాప క్షమాపణ మరియు నిత్యజీవం కోసం వస్తే చాలు.",
      hi: "20) 'जातिवाद से मुक्ति' जैसे सांसारिक लाभ के लिए किसी को यीशु के पास आने की ज़रूरत नहीं है! पापों की क्षमा और अनन्त जीवन के लिए आना ही पर्याप्त है।"
    },
    keywords: 'freedom from casteism saathiyathil irunthu viduthalai paava mannippu eternal life nithiya jeevan paapamochana'
  },
  {
    id: 21,
    type: 'caste-denial',
    path: '/caste-denial-qa/21',
    translations: {
      ta: '21) இயேசு சாதியை ஒழிக்கச் சொல்லவில்லையே! சாதியை ஒழியுங்கள் என்று மறைநூல் நமக்குக் கட்டளையிடவில்லையே!',
      en: "21) Jesus didn't say to abolish caste! Scripture hasn't commanded us to eradicate caste!",
      ml: '21) യേശു ജാതി ഉന്മൂലനം ചെയ്യാൻ പറഞ്ഞിട്ടില്ലല്ലോ! ജാതി ഉപേക്ഷിക്കാൻ തിരുവെഴുത്തുകൾ നമ്മോട് കൽപ്പിച്ചിട്ടില്ലല്ലോ!',
      kn: '21) ಯೇಸು ಜಾತಿಯನ್ನು ತೊಡೆದುಹಾಕಲು ಹೇಳಲಿಲ್ಲವಲ್ಲ! ಜಾತಿಯನ್ನು ತ್ಯಜಿಸಿ ಎಂದು ಪವಿತ್ರ ಗ್ರಂಥವು ನಮಗೆ ಆಜ್ಞಾಪಿಸಿಲ್ಲವಲ್ಲ!',
      te: '21) యేసు కులాన్ని నిర్మూలించమని చెప్పలేదు కదా! కులాన్ని విడిచిపెట్టమని గ్రంథం మనకు ఆజ్ఞాపించలేదు కదా!',
      hi: '21) यीशु ने जाति मिटाने को नहीं कहा! धर्मशास्त्र ने हमें जाति खत्म करने की आज्ञा नहीं दी है!'
    },
    keywords: 'abolish eradicate ozhikkach sollaveillai marainool bible command kattalai ozhiyungal nirmoolana'
  },
  {
    id: 22,
    type: 'caste-denial',
    path: '/caste-denial-qa/22',
    translations: {
      ta: '22) நீங்கள் விளம்பரப் பிரியர்கள். அதனால்தான் சாதிமறுப்பைப் பற்றி போதிக்கிறீர்கள்.',
      en: "22) You are publicity seekers. That's why you preach about caste denial/rejection.",
      ml: '22) നിങ്ങൾ പരസ്യപ്രേമികളാണ്. അതുകൊണ്ടാണ് ജാതിനിഷേധത്തെക്കുറിച്ച് പ്രസംഗിക്കുന്നത്.',
      kn: '22) ನೀವು ಪ್ರಚಾರ ಪ್ರಿಯರು. ಅದಕ್ಕಾಗಿಯೇ ಜಾತಿ ನಿರಾಕರಣೆಯ ಬಗ್ಗೆ ಬೋಧಿಸುತ್ತಿದ್ದೀರಿ.',
      te: '22) మీరు ప్రచార ప్రియులు. అందుకే కుల వ్యతిరేకత గురించి ప్రబోధిస్తున్నారు.',
      hi: '22) आप लोग केवल प्रचार के भूखे हैं। इसीलिए जाति-विरोधी बातें सिखा रहे हैं।'
    },
    keywords: 'publicity seekers vilambara priyargal saathimaruppu preach bothikkireergal prachara premi pracharam'
  },
  {
    id: 23,
    type: 'caste-denial',
    path: '/caste-denial-qa/23',
    translations: {
      ta: '23) சாதி பார்ப்பவர்கள் பரலோகம் போகமுடியாது என்று கூறுகிறீர்களா?',
      en: '23) Are you saying that those who practice or observe caste cannot go to heaven?',
      ml: '23) ജാതി നോക്കുന്നവർക്ക് സ്വർഗ്ഗത്തിൽ പോകാൻ കഴിയില്ലെന്നാണോ നിങ്ങൾ പറയുന്നത്?',
      kn: '23) ಜಾತಿ ನೋಡುವವರು ಪರಲೋಕಕ್ಕೆ ಹೋಗಲು ಸಾಧ್ಯವಿಲ್ಲ ಎಂದು ಹೇಳುತ್ತಿದ್ದೀರಾ?',
      te: '23) కులం చూసేవారు పరలోకానికి వెళ్లలేరని మీరు చెబుతున్నారా?',
      hi: '23) क्या आप कह रहे हैं कि जो लोग जाति मानते हैं वे स्वर्ग नहीं जा सकते?'
    },
    keywords: 'heaven paralogam saathi paarpavargal swargam caste observer cannot go to heaven pogamudiyadhu'
  },
  {
    id: 24,
    type: 'caste-denial',
    path: '/caste-denial-qa/24',
    translations: {
      ta: '24) ‘சாதி’ என்று அழைப்பதுதான் தவறு. அதை ‘குடி’ என்று அழைத்தால் தவறில்லையே!',
      en: "24) Calling it 'caste' (saathi) is wrong, but what is wrong if we call it 'kudi' (clan/community)?",
      ml: "24) 'ജാതി' എന്ന് വിളിക്കുന്നതാണ് തെറ്റ്. അതിനെ 'കുടി' (വംശം/കുലം) എന്ന് വിളിച്ചാൽ തെറ്റില്ലല്ലോ!",
      kn: "24) 'ಜಾತಿ' ಎಂದು ಕರೆಯುವುದು ತಪ್ಪು. ಆದರೆ ಅದನ್ನು 'ಕುಡಿ' (ಕುಲ/ವಂಶ) ಎಂದು ಕರೆದರೆ ತಪ್ಪೇನಿಲ್ಲವಲ್ಲ!",
      te: "24) 'కులం' అని పిలవడం తప్పు. దాన్ని 'కుడి' (వంశం/శాఖ) అని పిలిస్తే తప్పులేదు కదా!",
      hi: "24) 'जाति' कहना गलत है, लेकिन अगर हम इसे 'कुटुंब/कुल' कहें तो क्या बुराई है?"
    },
    keywords: 'kudi clan community saathi calling name thavaru kudi endru azhaithaal vamsam gothram'
  },
  {
    id: 25,
    type: 'caste-denial',
    path: '/caste-denial-qa/25',
    translations: {
      ta: '25) சாதி ஒழிந்துவிட்டால் தமிழன் என்ற நம் அடையாளமே ஒழிந்துவிடுமே!',
      en: '25) If caste is eradicated, our very identity as Tamils will be lost!',
      ml: '25) ജാതി ഇല്ലാതായാൽ തമിഴൻ എന്ന നമ്മുടെ വ്യക്തിത്വം തന്നെ ഇല്ലാതാകില്ലേ!',
      kn: '25) ಜಾತಿ ನಿರ್ಮೂಲನೆಯಾದರೆ ತಮಿಳಿಗರೆಂಬ ನಮ್ಮ ಗುರುತೇ ಅಳಿಸಿಹೋಗುವುದಿಲ್ಲವೇ!',
      te: '25) కులం నశిస్తే తమిళులమనే మన గుర్తింపే పోతుంది కదా!',
      hi: '25) यदि जाति समाप्त हो गई, तो तमिल के रूप में हमारी पहचान ही मिट जाएगी!'
    },
    keywords: 'tamil identity tamizhan adaiyalam destroyed ozhinthuvidume guruthu identity culture thamizhan'
  }
];

export interface SearchResultItem {
  id: number;
  type: 'common' | 'caste-denial';
  path: string;
  categoryLabel: string;
  displayQuestion: string;
  originalTamilQuestion: string;
  matchedText?: string;
  matchedInLang?: string;
  matchedIn: 'question' | 'answer';
  answerSnippet?: string;
}

export function searchQuestions(
  query: string,
  activeLang: 'ta' | 'en' | 'ml' | 'kn' | 'te' | 'hi',
  liveQuestions: { id: number; question: string; answer?: string; type: 'common' | 'caste-denial' }[] = []
): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Helper to extract clean answer snippet around match
  const extractSnippet = (cleanText: string, searchTerm: string): string => {
    const idx = cleanText.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (idx === -1) return '';
    const start = Math.max(0, idx - 35);
    const end = Math.min(cleanText.length, idx + searchTerm.length + 65);
    let snippet = cleanText.slice(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < cleanText.length) snippet = snippet + '...';
    return snippet;
  };

  const questionTitleResults: SearchResultItem[] = [];
  const answerOnlyResults: SearchResultItem[] = [];

  // Map live answers by type and id for quick lookup
  const liveAnswerMap = new Map<string, string>();
  for (const lq of liveQuestions) {
    if (lq.answer) {
      liveAnswerMap.set(`${lq.type}-${lq.id}`, lq.answer);
    }
  }

  for (const item of MULTILINGUAL_QUESTIONS) {
    const langList: ('ta' | 'en' | 'ml' | 'kn' | 'te' | 'hi')[] = ['ta', 'en', 'ml', 'kn', 'te', 'hi'];
    let matchedInQuestion = false;
    let matchedInLang: string | undefined = undefined;
    let matchedText: string | undefined = undefined;

    // 1. Check each language translation for substring match in question
    for (const lang of langList) {
      const text = item.translations[lang] || '';
      if (text.toLowerCase().includes(q)) {
        matchedInQuestion = true;
        matchedInLang = lang;
        matchedText = text;
        break;
      }
    }

    // 2. Check phonetic / transliterated keywords if not matched in question yet
    if (!matchedInQuestion && item.keywords.toLowerCase().includes(q)) {
      matchedInQuestion = true;
      matchedInLang = 'keywords';
    }

    // 3. Check answer text (multilingual answers database + live answers)
    let matchedInAnswer = false;
    let matchedAnswerLang: string | undefined = undefined;
    let answerSnippet: string | undefined = undefined;

    // Get the multilingual translations for this question's answer
    const groupKey = item.type === 'common' ? 'common' : 'casteDenial';
    const answerTranslations = (multilingualAnswers as any)[groupKey]?.[String(item.id)] || {};

    // Check live answer from database first if present
    const liveRawAnswer = liveAnswerMap.get(`${item.type}-${item.id}`);
    if (liveRawAnswer) {
      const cleanLive = liveRawAnswer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanLive.toLowerCase().includes(q)) {
        matchedInAnswer = true;
        matchedAnswerLang = 'ta';
        answerSnippet = extractSnippet(cleanLive, q);
      }
    }

    // If not matched in live answer, check precompiled multilingual answers
    if (!matchedInAnswer) {
      // Prioritize checking user's currently active language first
      const activeLangAnswer = (answerTranslations[activeLang] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (activeLangAnswer && activeLangAnswer.toLowerCase().includes(q)) {
        matchedInAnswer = true;
        matchedAnswerLang = activeLang;
        answerSnippet = extractSnippet(activeLangAnswer, q);
      } else {
        // Check all other available languages (ta, en, kn, te, ml, hi)
        for (const lang of langList) {
          const langAnswer = (answerTranslations[lang] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
          if (langAnswer && langAnswer.toLowerCase().includes(q)) {
            matchedInAnswer = true;
            matchedAnswerLang = lang;
            answerSnippet = extractSnippet(langAnswer, q);
            break;
          }
        }
      }
    }

    // Fallback to staticAnswers (Tamil) if not in multilingual answers
    if (!matchedInAnswer) {
      const rawAnswer =
        (item.type === 'common'
          ? (staticAnswers.common as Record<string, string>)[String(item.id)]
          : (staticAnswers.casteDenial as Record<string, string>)[String(item.id)]) ||
        '';
      const cleanAnswer = rawAnswer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanAnswer && cleanAnswer.toLowerCase().includes(q)) {
        matchedInAnswer = true;
        matchedAnswerLang = 'ta';
        answerSnippet = extractSnippet(cleanAnswer, q);
      }
    }

    if (matchedInQuestion || matchedInAnswer) {
      const displayQuestion = item.translations[activeLang] || item.translations.ta;
      const categoryLabel = CATEGORY_LABELS[item.type][activeLang] || CATEGORY_LABELS[item.type].ta;

      const resultItem: SearchResultItem = {
        id: item.id,
        type: item.type,
        path: item.path,
        categoryLabel,
        displayQuestion,
        originalTamilQuestion: item.translations.ta,
        matchedText,
        matchedInLang: matchedInQuestion ? matchedInLang : matchedAnswerLang,
        matchedIn: matchedInQuestion ? 'question' : 'answer',
        answerSnippet
      };

      if (matchedInQuestion) {
        questionTitleResults.push(resultItem);
      } else {
        answerOnlyResults.push(resultItem);
      }
    }
  }

  // 4. Also search any new questions from the live database not in precompiled set
  for (const extra of liveQuestions) {
    const alreadyExists =
      questionTitleResults.some(r => r.type === extra.type && r.id === extra.id) ||
      answerOnlyResults.some(r => r.type === extra.type && r.id === extra.id);

    if (!alreadyExists) {
      const qMatched = extra.question.toLowerCase().includes(q);
      const cleanAns = (extra.answer || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const aMatched = cleanAns.toLowerCase().includes(q);

      if (qMatched || aMatched) {
        const categoryLabel = CATEGORY_LABELS[extra.type][activeLang] || CATEGORY_LABELS[extra.type].ta;
        const path = extra.type === 'common' ? `/common-qa/${extra.id}` : `/caste-denial-qa/${extra.id}`;

        const item: SearchResultItem = {
          id: extra.id,
          type: extra.type,
          path,
          categoryLabel,
          displayQuestion: extra.question,
          originalTamilQuestion: extra.question,
          matchedIn: qMatched ? 'question' : 'answer',
          answerSnippet: aMatched ? extractSnippet(cleanAns, q) : undefined
        };

        if (qMatched) {
          questionTitleResults.push(item);
        } else {
          answerOnlyResults.push(item);
        }
      }
    }
  }

  // Question title matches appear first, followed by answer text matches
  return [...questionTitleResults, ...answerOnlyResults];
}
