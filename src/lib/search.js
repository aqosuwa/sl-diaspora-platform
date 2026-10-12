// Very small keyword router for the site search box — maps a free-text
// query to the most relevant module. Good enough for a prototype; a real
// build would index actual content.

const RULES = [
  { to: "/youth", words: ["youth", "young", "student", "mentor", "community board", "discussion"] },
  { to: "/consular", words: ["pay online", "payment", "fees", "orange money", "afrimoney", "visa card", "passport", "national id", "id card", "identity card", "visa", "travel certificate", "consular", "renew", "etc"] },
  { to: "/referrals", words: ["lawyer", "doctor", "referral", "confidential", "accountant", "therapist", "gp", "legal"] },
  { to: "/jobs", words: ["job", "work", "employment", "vacancy", "career", "hire"] },
  { to: "/businesses", words: ["business", "shop", "restaurant", "directory", "store"] },
  { to: "/events", words: ["event", "news", "festival", "celebration", "announcement"] },
];

export function routeForQuery(query) {
  const q = query.toLowerCase();
  for (const rule of RULES) {
    if (rule.words.some((w) => q.includes(w))) return rule.to;
  }
  return "/register";
}
