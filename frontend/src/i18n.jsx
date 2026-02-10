import { createContext, useContext, useMemo, useState } from "react";

const translations = {
  en: {
    appTitle: "Agriseva Platform",
    appCaption: "Empowering transparent, data-driven agricultural markets",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "कृषि एवं किसान कल्याण मंत्रालय · भारत सरकार",
    motto: "सत्यमेव जयते · Satyameva Jayate",
    officialDemo: "Official Demo",
    language: "Language",
    aadhaarLogin: "Aadhaar Login",
    dashboard: "Farmer Dashboard",
    priceForecast: "Price Forecast",
    weatherAlerts: "Weather Alerts",
    cropHealth: "Crop Health Map",
    auctions: "Auction Listings",
    feedback: "Feedback",
    welcomeBack: "Welcome back, {name}",
    heroSubtitle:
      "Your farm intelligence hub for smarter pricing, climate resilience, and fair auctions.",
    connected: "Connected to eNAM-ready data feeds",
    latestActivity: "Latest Activity",
    tomatoSpike: "Tomato price spike",
    bestWindow: "Nagpur · Best selling window in 5 days",
    ndviAlert: "NDVI alert",
    ndviDetail: "Farm-003 shows high stress",
    actionNeeded: "Action needed"
  },
  hi: {
    appTitle: "अग्रीसेवा प्लेटफ़ॉर्म",
    appCaption: "पारदर्शी, डेटा‑आधारित कृषि बाजारों को सशक्त बनाना",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "कृषि एवं किसान कल्याण मंत्रालय · भारत सरकार",
    motto: "सत्यमेव जयते · Satyameva Jayate",
    officialDemo: "आधिकारिक डेमो",
    language: "भाषा",
    aadhaarLogin: "आधार लॉगिन",
    dashboard: "किसान डैशबोर्ड",
    priceForecast: "मूल्य पूर्वानुमान",
    weatherAlerts: "मौसम अलर्ट",
    cropHealth: "फसल स्वास्थ्य मानचित्र",
    auctions: "नीलामी सूची",
    feedback: "प्रतिक्रिया",
    welcomeBack: "स्वागत है, {name}",
    heroSubtitle:
      "स्मार्ट मूल्य, जलवायु‑लचीलापन और निष्पक्ष नीलामी के लिए आपका कृषि इंटेलिजेंस हब।",
    connected: "eNAM‑तैयार डेटा फीड से जुड़ा",
    latestActivity: "हाल की गतिविधि",
    tomatoSpike: "टमाटर कीमत बढ़त",
    bestWindow: "नागपुर · 5 दिनों में सर्वोत्तम बिक्री विंडो",
    ndviAlert: "NDVI अलर्ट",
    ndviDetail: "Farm-003 पर उच्च तनाव",
    actionNeeded: "कार्रवाई आवश्यक"
  },
  bn: {
    appTitle: "এগ্রিসেবা প্ল্যাটফর্ম",
    appCaption: "স্বচ্ছ, তথ্যনির্ভর কৃষি বাজারকে শক্তিশালী করা",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "কৃষি ও কৃষক কল্যাণ মন্ত্রণালয় · ভারত সরকার",
    motto: "সত্যমেব জয়তে · Satyameva Jayate",
    officialDemo: "আধিকারিক ডেমো",
    language: "ভাষা",
    aadhaarLogin: "আধার লগইন",
    dashboard: "কৃষক ড্যাশবোর্ড",
    priceForecast: "দাম পূর্বাভাস",
    weatherAlerts: "আবহাওয়া সতর্কতা",
    cropHealth: "ফসল স্বাস্থ্য মানচিত্র",
    auctions: "নিলাম তালিকা",
    feedback: "মতামত",
    welcomeBack: "স্বাগতম, {name}",
    heroSubtitle:
      "স্মার্ট মূল্য, জলবায়ু সহনশীলতা ও ন্যায্য নিলামের জন্য আপনার কৃষি ইন্টেলিজেন্স হাব।",
    connected: "eNAM‑প্রস্তুত ডেটা ফিডের সাথে সংযুক্ত",
    latestActivity: "সাম্প্রতিক কার্যক্রম",
    tomatoSpike: "টমেটো দামে বৃদ্ধি",
    bestWindow: "নাগপুর · ৫ দিনে সেরা বিক্রয় সময়",
    ndviAlert: "NDVI সতর্কতা",
    ndviDetail: "Farm-003 উচ্চ স্ট্রেস দেখাচ্ছে",
    actionNeeded: "কার্যক্রম প্রয়োজন"
  },
  gu: {
    appTitle: "એગ્રિસેવા પ્લેટફોર્મ",
    appCaption: "પારદર્શક, ડેટા આધારિત કૃષિ બજારોને શક્તિશાળી બનાવવું",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય · ભારત સરકાર",
    motto: "સત્યમેવ જયતે · Satyameva Jayate",
    officialDemo: "અધિકૃત ડેમો",
    language: "ભાષા",
    aadhaarLogin: "આધાર લોગિન",
    dashboard: "ખેડૂત ડેશબોર્ડ",
    priceForecast: "ભાવ પૂર્વાનુમાન",
    weatherAlerts: "હવામાન એલર્ટ",
    cropHealth: "પાક સ્વાસ્થ્ય નકશો",
    auctions: "હરાજી સૂચિ",
    feedback: "પ્રતિસાદ",
    welcomeBack: "સ્વાગત છે, {name}",
    heroSubtitle:
      "સ્માર્ટ ભાવ, હવામાન સહનશીલતા અને ન્યાયી હરાજી માટે તમારું કૃષિ ઇન્ટેલિજન્સ હબ.",
    connected: "eNAM‑તૈયાર ડેટા ફીડ સાથે જોડાયેલ",
    latestActivity: "તાજેતરની પ્રવૃત્તિ",
    tomatoSpike: "ટામેટાના ભાવમાં ઉછાળો",
    bestWindow: "નાગપુર · 5 દિવસમાં શ્રેષ્ઠ વેચાણ સમય",
    ndviAlert: "NDVI એલર્ટ",
    ndviDetail: "Farm-003 માં ઊંચો તણાવ",
    actionNeeded: "ક્રિયા જરૂરી"
  },
  mr: {
    appTitle: "अग्रिसेवा प्लॅटफॉर्म",
    appCaption: "पारदर्शक, डेटा‑आधारित कृषी बाजारांना सक्षम करणे",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "कृषी व शेतकरी कल्याण मंत्रालय · भारत सरकार",
    motto: "सत्यमेव जयते · Satyameva Jayate",
    officialDemo: "अधिकृत डेमो",
    language: "भाषा",
    aadhaarLogin: "आधार लॉगिन",
    dashboard: "शेतकरी डॅशबोर्ड",
    priceForecast: "भाव अंदाज",
    weatherAlerts: "हवामान अलर्ट",
    cropHealth: "पीक आरोग्य नकाशा",
    auctions: "लिलाव यादी",
    feedback: "अभिप्राय",
    welcomeBack: "स्वागत आहे, {name}",
    heroSubtitle:
      "स्मार्ट भाव, हवामान सहनशीलता आणि न्याय्य लिलावासाठी तुमचे कृषी इंटेलिजन्स हब.",
    connected: "eNAM‑तयार डेटा फीडशी जोडलेले",
    latestActivity: "अलीकडील हालचाली",
    tomatoSpike: "टोमॅटो भाव वाढ",
    bestWindow: "नागपूर · 5 दिवसांत सर्वोत्तम विक्री वेळ",
    ndviAlert: "NDVI अलर्ट",
    ndviDetail: "Farm-003 मध्ये उच्च ताण",
    actionNeeded: "कारवाई आवश्यक"
  },
  te: {
    appTitle: "అగ్రిసేవా ప్లాట్‌ఫారం",
    appCaption: "పారదర్శక, డేటా ఆధారిత వ్యవసాయ మార్కెట్లను శక్తివంతం చేయడం",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "కృషి మరియు రైతు సంక్షేమ మంత్రిత్వ శాఖ · భారత ప్రభుత్వం",
    motto: "సత్యమేవ జయతే · Satyameva Jayate",
    officialDemo: "అధికారిక డెమో",
    language: "భాష",
    aadhaarLogin: "ఆధార్ లాగిన్",
    dashboard: "రైతు డాష్‌బోర్డ్",
    priceForecast: "ధర అంచనా",
    weatherAlerts: "వాతావరణ అలర్ట్స్",
    cropHealth: "పంట ఆరోగ్య మ్యాప్",
    auctions: "వేలం జాబితాలు",
    feedback: "ఫీడ్‌బ్యాక్",
    welcomeBack: "స్వాగతం, {name}",
    heroSubtitle:
      "స్మార్ట్ ధరలు, వాతావరణ సహనశీలత మరియు న్యాయమైన వేలం కోసం మీ వ్యవసాయ ఇంటెలిజెన్స్ హబ్.",
    connected: "eNAM‑సిద్ధ డేటా ఫీడ్స్‌కు కలిపి ఉంది",
    latestActivity: "ఇటీవలి కార్యకలాపాలు",
    tomatoSpike: "టమాటా ధరలు పెరగడం",
    bestWindow: "నాగ్‌పూర్ · 5 రోజుల్లో ఉత్తమ అమ్మక సమయం",
    ndviAlert: "NDVI అలర్ట్",
    ndviDetail: "Farm-003 లో అధిక ఒత్తిడి",
    actionNeeded: "చర్య అవసరం"
  },
  ta: {
    appTitle: "அக்ரிசேவா தளம்",
    appCaption: "தெளிவான, தரவழி வேளாண் சந்தைகளை பலப்படுத்துதல்",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "வேளாண்மை மற்றும் விவசாயிகள் நலத்துறை · இந்திய அரசு",
    motto: "சத்யமேவ ஜயதே · Satyameva Jayate",
    officialDemo: "அதிகாரப்பூர்வ டெமோ",
    language: "மொழி",
    aadhaarLogin: "ஆதார் உள்நுழைவு",
    dashboard: "விவசாயி டாஷ்போர்டு",
    priceForecast: "விலை முன்னறிவிப்பு",
    weatherAlerts: "வானிலை எச்சரிக்கைகள்",
    cropHealth: "பயிர் ஆரோக்கிய வரைபடம்",
    auctions: "ஏலம் பட்டியல்",
    feedback: "கருத்து",
    welcomeBack: "மீண்டும் வருக, {name}",
    heroSubtitle:
      "சிறந்த விலை, காலநிலை தாங்குதல் மற்றும் நியாயமான ஏலங்களுக்கு உங்கள் வேளாண் அறிவூட்டல் மையம்.",
    connected: "eNAM‑தயார் தரவு ஊட்டங்களுடன் இணைக்கப்பட்டது",
    latestActivity: "சமீபத்திய செயற்பாடு",
    tomatoSpike: "தக்காளி விலை உயர்வு",
    bestWindow: "நாக்பூர் · 5 நாட்களில் சிறந்த விற்பனை நேரம்",
    ndviAlert: "NDVI எச்சரிக்கை",
    ndviDetail: "Farm-003 உயர் அழுத்தம் காட்டுகிறது",
    actionNeeded: "நடவடிக்கை தேவை"
  },
  kn: {
    appTitle: "ಅಗ್ರಿಸೇವಾ ವೇದಿಕೆ",
    appCaption: "ಪಾರದರ್ಶಕ, ಡೇಟಾ ಆಧಾರಿತ ಕೃಷಿ ಮಾರುಕಟ್ಟೆಗಳನ್ನು ಸಬಲಗೊಳಿಸುವುದು",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "ಕೃಷಿ ಮತ್ತು ರೈತ ಕಲ್ಯಾಣ ಮಂತ್ರಾಲಯ · ಭಾರತ ಸರ್ಕಾರ",
    motto: "ಸತ್ಯಮೇವ ಜಯತೆ · Satyameva Jayate",
    officialDemo: "ಅಧಿಕೃತ ಡೆಮೊ",
    language: "ಭಾಷೆ",
    aadhaarLogin: "ಆಧಾರ್ ಲಾಗಿನ್",
    dashboard: "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    priceForecast: "ಬೆಲೆ ಅಂದಾಜು",
    weatherAlerts: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ",
    cropHealth: "ಬೆಳೆ ಆರೋಗ್ಯ ನಕ್ಷೆ",
    auctions: "ಹರಾಜು ಪಟ್ಟಿ",
    feedback: "ಪ್ರತಿಕ್ರಿಯೆ",
    welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ, {name}",
    heroSubtitle:
      "ಸ್ಮಾರ್ಟ್ ಬೆಲೆ, ಹವಾಮಾನ ಸಹನಶೀಲತೆ ಮತ್ತು ನ್ಯಾಯವಾದ ಹರಾಜಿಗಾಗಿ ನಿಮ್ಮ ಕೃಷಿ ಇಂಟೆಲಿಜೆನ್ಸ್ ಹಬ್.",
    connected: "eNAM‑ಸಿದ್ಧ ಡೇಟಾ ಫೀಡ್ಗಳೊಂದಿಗೆ ಜೋಡಿಸಲಾಗಿದೆ",
    latestActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    tomatoSpike: "ಟೊಮಾಟೋ ಬೆಲೆ ಏರಿಕೆ",
    bestWindow: "ನಾಗ್ಪುರ · 5 ದಿನಗಳಲ್ಲಿ ಉತ್ತಮ ಮಾರಾಟ ಸಮಯ",
    ndviAlert: "NDVI ಎಚ್ಚರಿಕೆ",
    ndviDetail: "Farm-003 ನಲ್ಲಿ ಹೆಚ್ಚಿನ ಒತ್ತಡ",
    actionNeeded: "ಕ್ರಮ ಅಗತ್ಯ"
  },
  ml: {
    appTitle: "അഗ്രിസേവ പ്ലാറ്റ്‌ഫോം",
    appCaption: "പാരദർശകമായ, ഡാറ്റ അടിസ്ഥാനമാക്കിയ കാർഷിക വിപണികളെ ശക്തിപ്പെടുത്തൽ",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "കൃഷി & കര്‍ഷക ക്ഷേമ മന്ത്രാലയം · ഇന്ത്യ സർക്കാർ",
    motto: "സത്യമേവ ജയതേ · Satyameva Jayate",
    officialDemo: "ഔദ്യോഗിക ഡെമോ",
    language: "ഭാഷ",
    aadhaarLogin: "ആധാർ ലോഗിൻ",
    dashboard: "കർഷക ഡാഷ്ബോർഡ്",
    priceForecast: "വില പ്രവചനം",
    weatherAlerts: "കാലാവസ്ഥ അലർട്ടുകൾ",
    cropHealth: "വിളാരോഗ്യ മാപ്പ്",
    auctions: "ലേല പട്ടിക",
    feedback: "അഭിപ്രായം",
    welcomeBack: "സ്വാഗതം, {name}",
    heroSubtitle:
      "സ്മാർട്ട് വില, കാലാവസ്ഥ പ്രതിരോധം, നീതിയുള്ള ലേലത്തിനുള്ള നിങ്ങളുടെ കാർഷിക ഇന്റലിജൻസ് ഹബ്.",
    connected: "eNAM‑തയാറായ ഡാറ്റാ ഫീഡുകളുമായി ബന്ധിപ്പിച്ചു",
    latestActivity: "ഇತ್ತೀಚത്തെ പ്രവർത്തനം",
    tomatoSpike: "തക്കാളി വില ഉയർച്ച",
    bestWindow: "നാഗ്പൂർ · 5 ദിവസത്തിൽ മികച്ച വില്പന സമയം",
    ndviAlert: "NDVI അലർട്ട്",
    ndviDetail: "Farm-003 ഉയർന്ന സമ്മർദ്ദം കാണിക്കുന്നു",
    actionNeeded: "നടപടി ആവശ്യമാണ്"
  },
  or: {
    appTitle: "ଆଗ୍ରିସେବା ପ୍ଲାଟଫର୍ମ",
    appCaption: "ପାରଦର୍ଶୀ, ତଥ୍ୟ ଆଧାରିତ କୃଷି ବଜାରକୁ ସଶକ୍ତ କରିବା",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "କୃଷି ଏବଂ କୃଷକ କଲ୍ୟାଣ ମନ୍ତ୍ରଣାଳୟ · ଭାରତ ସରକାର",
    motto: "ସତ୍ୟମେବ ଜୟତେ · Satyameva Jayate",
    officialDemo: "ଅଧିକୃତ ଡେମୋ",
    language: "ଭାଷା",
    aadhaarLogin: "ଆଧାର ଲଗିନ୍",
    dashboard: "କୃଷକ ଡ୍ୟାଶବୋର୍ଡ",
    priceForecast: "ଦର ପୂର୍ବାନୁମାନ",
    weatherAlerts: "ଆବହା ପତ୍ରାଦେଶ",
    cropHealth: "ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ମାନଚିତ୍ର",
    auctions: "ନିଲାମ ତାଲିକା",
    feedback: "ମତାମତ",
    welcomeBack: "ସ୍ଵାଗତମ୍, {name}",
    heroSubtitle:
      "ସ୍ମାର୍ଟ ଦର, ଆବହା ସହନଶୀଳତା ଏବଂ ନ୍ୟାୟସଙ୍ଗତ ନିଲାମ ପାଇଁ ଆପଣଙ୍କ କୃଷି ଇନ୍ଟେଲିଜେନ୍ସ ହବ୍।",
    connected: "eNAM‑ତୟାରି ତଥ୍ୟ ଫିଡ୍ ସହିତ ସଂଯୁକ୍ତ",
    latestActivity: "ସମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ",
    tomatoSpike: "ଟମାଟୋ ଦର ବୃଦ୍ଧି",
    bestWindow: "ନାଗପୁର · 5 ଦିନରେ ଶ୍ରେଷ୍ଠ ବିକ୍ରି ସମୟ",
    ndviAlert: "NDVI ସତର୍କତା",
    ndviDetail: "Farm-003 ଉଚ୍ଚ ଚାପ ଦେଖାଉଛି",
    actionNeeded: "କାର୍ଯ୍ୟ ଆବଶ୍ୟକ"
  },
  pa: {
    appTitle: "ਅਗਰੀਸੇਵਾ ਪਲੇਟਫਾਰਮ",
    appCaption: "ਪਾਰਦਰਸ਼ਕ, ਡਾਟਾ ਆਧਾਰਿਤ ਖੇਤੀਬਾੜੀ ਬਾਜ਼ਾਰਾਂ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "ਕ੍ਰਿਸ਼ੀ ਅਤੇ ਕਿਸਾਨ ਕਲਿਆਣ ਮੰਤਰਾਲਾ · ਭਾਰਤ ਸਰਕਾਰ",
    motto: "ਸੱਤ्यमੇਵ ਜਯਤੇ · Satyameva Jayate",
    officialDemo: "ਅਧਿਕਾਰਕ ਡੈਮੋ",
    language: "ਭਾਸ਼ਾ",
    aadhaarLogin: "ਆਧਾਰ ਲਾਗਿਨ",
    dashboard: "ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ",
    priceForecast: "ਕੀਮਤ ਅਨੁਮਾਨ",
    weatherAlerts: "ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ",
    cropHealth: "ਫਸਲ ਸਿਹਤ ਨਕਸ਼ਾ",
    auctions: "ਨੀਲਾਮ ਸੂਚੀ",
    feedback: "ਫੀਡਬੈਕ",
    welcomeBack: "ਸਵਾਗਤ ਹੈ, {name}",
    heroSubtitle:
      "ਸਮਝਦਾਰ ਕੀਮਤ, ਮੌਸਮੀ ਲਚਕੀਲੇਪਨ ਅਤੇ ਨਿਆਂਯੁਕਤ ਨੀਲਾਮੀ ਲਈ ਤੁਹਾਡਾ ਖੇਤੀਬਾੜੀ ਇੰਟੈਲੀਜੈਂਸ ਹਬ।",
    connected: "eNAM‑ਤਿਆਰ ਡਾਟਾ ਫੀਡ ਨਾਲ ਜੁੜਿਆ",
    latestActivity: "ਤਾਜ਼ਾ ਗਤੀਵਿਧੀ",
    tomatoSpike: "ਟਮਾਟਰ ਕੀਮਤ ਵਾਧਾ",
    bestWindow: "ਨਾਗਪੁਰ · 5 ਦਿਨਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਵਧੀਆ ਵਿਕਰੀ ਸਮਾਂ",
    ndviAlert: "NDVI ਚੇਤਾਵਨੀ",
    ndviDetail: "Farm-003 ਵਿੱਚ ਉੱਚ ਦਬਾਅ",
    actionNeeded: "ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ"
  },
  as: {
    appTitle: "এগ্ৰিসেৱা প্লাটফৰ্ম",
    appCaption: "পাৰদৰ্শক, ডাটাভিত্তিক কৃষি বজাৰক সক্ষম কৰা",
    ministryEn: "Ministry of Agriculture & Farmers Welfare · Government of India",
    ministryHi: "কৃষি আৰু কৃষক কল্যাণ মন্ত্রণালয় · ভাৰত চৰকাৰ",
    motto: "সত্যমেব জয়তে · Satyameva Jayate",
    officialDemo: "আধिकारिक ডেমো",
    language: "ভাষা",
    aadhaarLogin: "আধাৰ লগিন",
    dashboard: "কৃষক ড্যাশব’ৰ্ড",
    priceForecast: "দামৰ অনুমান",
    weatherAlerts: "বতৰ সতর্কতা",
    cropHealth: "ফসল স্বাস্থ্য মানচিত্র",
    auctions: "নিলাম তালিকা",
    feedback: "প্ৰতিক্ৰিয়া",
    welcomeBack: "স্বাগতম, {name}",
    heroSubtitle:
      "স্মাৰ্ট দাম, জলবায়ু সহনশীলতা আৰু ন্যায়সংগত নিলামৰ বাবে আপোনাৰ কৃষি ইন্টেলিজেন্স হাব।",
    connected: "eNAM‑প্ৰস্তুত ডাটা ফীডৰ সৈতে সংযুক্ত",
    latestActivity: "শেহতীয়া কাৰ্যকলাপ",
    tomatoSpike: "টমেটো দাম বৃদ্ধি",
    bestWindow: "নাগপুৰ · 5 দিনে সৰ্বশ্ৰেষ্ঠ বিক্ৰী সময়",
    ndviAlert: "NDVI সতর্কতা",
    ndviDetail: "Farm-003 ত উচ্চ চাপ",
    actionNeeded: "কাৰ্য্য প্ৰয়োজন"
  }
};

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key, params) => (params ? key : key)
});

export function LanguageProvider({ children }) {
  const stored = localStorage.getItem("agriseva_lang") || "en";
  const [language, setLanguageState] = useState(stored);

  const setLanguage = (nextLang) => {
    localStorage.setItem("agriseva_lang", nextLang);
    setLanguageState(nextLang);
  };

  const t = (key, params) => {
    const langPack = translations[language] || translations.en;
    const template = langPack[key] || translations.en[key] || key;
    if (!params) {
      return template;
    }
    return Object.keys(params).reduce(
      (acc, paramKey) => acc.replace(`{${paramKey}}`, params[paramKey]),
      template
    );
  };

  const value = useMemo(() => ({ language, setLanguage, t }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
