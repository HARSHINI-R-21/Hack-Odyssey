// server/middleware/moderation.js

// Multilingual Content Moderation Engine (English, Tamil, Hindi, Spanish, French, German)

export const INAPPROPRIATE_TERMS = [
  // English toxic / cheat / scam terms
  "hack account", "cheat in exam", "leak test", "free money", "crypto pump",
  "casino", "gambling", "buy followers", "whatsapp spam", "hate", "abusive",
  "stupid", "dumb", "curse", "fuck", "shit", "bitch", "bastard", "asshole",
  "scam", "nude", "porn", "betting app", "free cash", "telegram link", "fake cert",

  // Tamil inappropriate / scam / cheat terms (தமிழ்)
  "பரீட்சை காப்பி", "காசு தருவதாக", "சூதாட்டம்", "போலி சான்றிதழ்", "டெலிகிராம் லின்க்",
  "பணம் சம்பாதிக்க", "மோசடி", "பப்ஜி ஹேக்", "தேர்வு லீக்",

  // Hindi inappropriate / scam terms (हिंदी)
  "परीक्षा चीटिंग", "पेपर लीक", "मुफ्त पैसे", "सट्टा", "कैसीनो", "धोखाधड़ी", "टेलीग्राम लिंक", "नकली सर्टिफिकेट",

  // Spanish (Español)
  "trampa examen", "filtrar examen", "dinero gratis", "apuestas", "estafas",

  // French (Français)
  "triche examen", "fuite examen", "argent gratuit", "parier", "arnaque",

  // German (Deutsch)
  "prüfung spicken", "gratis geld", "glücksspiel", "betrug"
];

export const NON_ACADEMIC_TERMS = [
  // English off-topic / gaming / spam terms
  "valorant match", "fortnite squad", "roblox code", "free vbucks", 
  "sell sneakers", "trade crypto", "party tonight", "gossip", "dating app", "pubg game",

  // Tamil non-academic / off-topic terms (தமிழ்)
  "சினிமா டிக்கெட்", "பப்ஜி மேட்ச்", "பார்ட்டி போகலாம்", "கிரிக்கெட் பார்க்க",
  "டேட்டிங் ஆப்", "கேமிங் விளையாட", "திரைப்படம்", "ஆட்டம் போடலாம்",

  // Hindi off-topic terms (हिंदी)
  "गेमिंग मैच", "पार्टी करेंगे", "क्रिकेट मैच", "डेटिंग ऐप", "मूवी देखने", "पबजी गेम",

  // Spanish off-topic
  "fiesta esta noche", "jugar fortnite", "chismes", "app citas",

  // French off-topic
  "fête ce soir", "jouer fortnite", "application rencontre",

  // German off-topic
  "party heute", "fortnite zocken", "dating app"
];

export function moderateMessage(text) {
  if (!text || typeof text !== "string") {
    return { isAllowed: false, reason: "Message cannot be empty" };
  }

  const normalized = text.toLowerCase().trim();
  
  // 1. Check inappropriate / toxic / cheat language across all supported languages
  const matchedInappropriate = INAPPROPRIATE_TERMS.filter(term => normalized.includes(term.toLowerCase()));
  if (matchedInappropriate.length > 0) {
    return {
      isAllowed: false,
      reason: `Message blocked by SkillBridge Academic Moderation. Detected non-academic / inappropriate terms: "${matchedInappropriate.join(', ')}".`,
      matchedTerms: matchedInappropriate,
      severity: "high"
    };
  }

  // 2. Check non-academic / off-topic spam terms
  const matchedNonAcademic = NON_ACADEMIC_TERMS.filter(term => normalized.includes(term.toLowerCase()));
  if (matchedNonAcademic.length > 0) {
    return {
      isAllowed: false,
      reason: `Message blocked: Off-topic or non-study content detected ("${matchedNonAcademic.join(', ')}"). Please keep discussions strictly academic!`,
      matchedTerms: matchedNonAcademic,
      severity: "medium"
    };
  }

  // 3. Detect suspicious external links (e.g. non-academic URL spam)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = normalized.match(urlRegex) || [];
  const allowedDomains = ["github.com", "coursera.org", "skillbridge.edu", "leetcode.com", "youtube.com", "medium.com", "arxiv.org", "stackoverflow.com"];
  
  for (const url of urls) {
    const isAllowedUrl = allowedDomains.some(domain => url.includes(domain));
    if (!isAllowedUrl) {
      return {
        isAllowed: false,
        reason: `External links in study room must be academic resources (GitHub, Coursera, LeetCode, arXiv, StackOverflow, etc.).`,
        matchedTerms: [url],
        severity: "low"
      };
    }
  }

  return { isAllowed: true, reason: "Approved academic message" };
}
