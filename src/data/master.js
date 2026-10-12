// Master admin: roles, permissions, and starting data for moderation features.

export const ROLES = {
  "Master admin": ["overview", "members", "ids", "chats", "reports", "content", "broadcast", "staff", "audit"],
  "Verifier": ["overview", "ids"],
  "Moderator": ["overview", "members", "chats", "reports"],
  "Content editor": ["overview", "content", "broadcast"],
};

export const ROLE_NAMES = Object.keys(ROLES);

// Commission staff work the consular desk (/admin), not the master console.
export const COMMISSION_ROLES = ["Consular officer", "Caseworker"];
export const areaOfRole = (role) => (COMMISSION_ROLES.includes(role) ? "commission" : "master");

export const SECTIONS = [
  { key: "overview", to: "/master", label: "Overview", icon: "home" },
  { key: "members", to: "/master/members", label: "Members", icon: "users" },
  { key: "ids", to: "/master/ids", label: "ID verification", icon: "idcard" },
  { key: "chats", to: "/master/chats", label: "Chat moderation", icon: "chat" },
  { key: "reports", to: "/master/reports", label: "Reports", icon: "flag" },
  { key: "content", to: "/master/content", label: "Site content", icon: "edit" },
  { key: "broadcast", to: "/master/broadcast", label: "Broadcasts", icon: "megaphone" },
  { key: "staff", to: "/master/staff", label: "Staff and roles", icon: "key" },
  { key: "audit", to: "/master/audit", label: "Audit log", icon: "list" },
];

export const CHAT_ROOMS = [
  { key: "general", label: "General", blurb: "Everyday conversation for the whole community." },
  { key: "careers", label: "Jobs and careers", blurb: "Share leads, CV tips and workplace advice." },
  { key: "newcomers", label: "New to the UK", blurb: "Settling in: housing, GP registration, transport." },
  { key: "home", label: "Back home", blurb: "News, travel and projects in Sierra Leone." },
  { key: "youth", label: "Youth group chat", blurb: "The live group chat on the Youth connection page.", hidden: true },
];

export const REPORT_REASONS = [
  "Spam or scam",
  "Harassment or abuse",
  "Fake or misleading",
  "Inappropriate content",
  "Other",
];

export const DEFAULT_BANNED_WORDS = [
  "western union",
  "send money first",
  "guaranteed visa",
  "fast-track visa",
  "bitcoin",
  "idiot",
  "stupid",
];

export const seedStaff = [
  { id: "staff_master", name: "Akosua Frimpong", email: "master@slhc-diaspora.org", role: "Master admin", area: "master", active: true },
  { id: "staff_2", name: "Sorie Kanu", email: "s.kanu@slhc-diaspora.org", role: "Verifier", area: "master", active: true },
  { id: "staff_3", name: "Mariatu Jalloh", email: "m.jalloh@slhc-diaspora.org", role: "Moderator", area: "master", active: true },
  { id: "staff_4", name: "Joseph Bockarie", email: "j.bockarie@slhc-diaspora.org", role: "Content editor", area: "master", active: true },
  { id: "staff_5", name: "Hawa Sesay", email: "h.sesay@slhc.gov.sl", role: "Consular officer", area: "commission", active: true },
  { id: "staff_6", name: "Alpha Conteh", email: "a.conteh@slhc.gov.sl", role: "Caseworker", area: "commission", active: true },
];

export const seedSiteSettings = {
  banner: { active: false, text: "Passport appointments for December are now open.", tone: "info" },
  heroHeadline: "Passports, ID cards and visas, without the trip to the High Commission.",
  heroSub:
    "Apply, pay and track consular services online, and connect with jobs, businesses, events and trusted professionals across the Sierra Leone community.",
  contactEmail: "info@slhc-diaspora.org",
  faqs: [
    {
      id: "faq_1",
      q: "How long does a passport renewal take?",
      a: "Most renewals are processed within 4 to 6 weeks once your application and payment are confirmed.",
    },
    {
      id: "faq_2",
      q: "Is what I tell a doctor or lawyer kept private?",
      a: "Yes. Referral requests are only visible to the caseworker handling them and the professional you are matched with.",
    },
    {
      id: "faq_3",
      q: "How do I get a Verified badge?",
      a: "Upload a valid passport or national ID when you register. A Commission verifier checks it, usually within two working days.",
    },
  ],
  bannedWords: DEFAULT_BANNED_WORDS,
};

const daysAgo = (n, h = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, 0, 0, 0);
  return d.toISOString();
};

export const seedChatMessages = [
  { id: "cm_1", room: "general", memberId: "mem_1", text: "Good morning everyone. Anyone going to the Independence Day event in London next April?", at: daysAgo(3, 9) },
  { id: "cm_2", room: "general", memberId: "mem_2", text: "Count me in. Will there be food stalls again this year?", at: daysAgo(3, 10) },
  { id: "cm_3", room: "careers", memberId: "mem_1", text: "Riverside Care Home is hiring nurses, details are on the Jobs board.", at: daysAgo(2, 14) },
  {
    id: "cm_4",
    room: "careers",
    memberId: "mem_6",
    text: "I can get you a guaranteed visa in 2 weeks. Send money first via Western Union and message me privately.",
    at: daysAgo(2, 16),
    flagged: true,
    flagSource: "auto",
    flagReason: "Matched banned phrases: guaranteed visa, western union, send money first",
    modStatus: "open",
  },
  { id: "cm_5", room: "newcomers", memberId: "mem_3", text: "Does anyone know how to register with a GP in Birmingham without proof of address?", at: daysAgo(1, 11) },
  {
    id: "cm_6",
    room: "newcomers",
    memberId: "mem_2",
    text: "You are an idiot if you think that works, stop giving people wrong advice.",
    at: daysAgo(1, 12),
    flagged: true,
    flagSource: "report",
    flagReason: "Harassment or abuse",
    reportedBy: "mem_1",
    modStatus: "open",
  },
  { id: "cm_8", room: "youth", memberId: "mem_2", text: "Hey everyone, anyone at uni in Manchester or Leeds? Thinking of starting a study group.", at: daysAgo(1, 18) },
  { id: "cm_9", room: "youth", memberId: "mem_1", text: "Great idea. I can share notes from my nursing course if that helps.", at: daysAgo(1, 19) },
  { id: "cm_7", room: "home", memberId: "mem_1", text: "Has anyone travelled to Freetown recently? How was the airport transfer?", at: daysAgo(0, 8) },
];

export const seedReports = [
  {
    id: "rp_1",
    kind: "job",
    targetId: "job_2",
    reason: "Fake or misleading",
    detail: "Salary looks too high for this role and the company has no website.",
    byMemberId: "mem_2",
    at: daysAgo(2, 9),
    status: "open",
  },
  {
    id: "rp_2",
    kind: "member",
    targetId: "mem_6",
    reason: "Spam or scam",
    detail: "Offering visas for money in the Careers chat.",
    byMemberId: "mem_1",
    at: daysAgo(2, 17),
    status: "open",
  },
];

// Extra members so the ID queue has realistic edge cases.
export const extraMembers = [
  {
    id: "mem_4",
    fullName: "Ibrahim Turay",
    email: "ibrahim.turay@example.com",
    city: "Leeds",
    phone: "+44 7700 900444",
    isYouth: false,
    isProfessional: false,
    verificationStatus: "pending",
    joinedAt: daysAgo(4),
    idRef: "SL-PASS-440218",
    idDoc: { type: "Passport", number: "SL-PASS-440218", nameOnId: "Ibrahim Turay", expiry: "2025-03-14", photoClear: true },
  },
  {
    id: "mem_5",
    fullName: "Kadiatu Conteh",
    email: "kadiatu.conteh@example.com",
    city: "Bristol",
    phone: "+44 7700 900555",
    isYouth: false,
    isProfessional: false,
    verificationStatus: "pending",
    joinedAt: daysAgo(2),
    idRef: "SL-NID-772910",
    idDoc: { type: "National ID", number: "SL-NID-772910", nameOnId: "Kadiatu M. Koroma", expiry: "2030-06-01", photoClear: true },
  },
  {
    id: "mem_6",
    fullName: "Alusine Barrie",
    email: "alusine.barrie@example.com",
    city: "London",
    phone: "+44 7700 900666",
    isYouth: false,
    isProfessional: false,
    verificationStatus: "pending",
    joinedAt: daysAgo(3),
    idRef: "SL-PASS-884213",
    idDoc: { type: "Passport", number: "SL-PASS-884213", nameOnId: "Alusine Barrie", expiry: "2029-09-30", photoClear: false },
  },
];

export function defaultIdDoc(m) {
  return {
    type: m.idRef?.includes("NID") ? "National ID" : "Passport",
    number: m.idRef || "",
    nameOnId: m.fullName,
    expiry: m.verificationStatus === "verified" ? "2030-01-01" : "2029-01-01",
    photoClear: true,
  };
}

export function idChecks(member, allMembers) {
  const doc = member.idDoc || defaultIdDoc(member);
  const today = new Date().toISOString().slice(0, 10);
  const norm = (s) => (s || "").toLowerCase().replace(/[^a-z]/g, "");
  return [
    { key: "name", label: "Name on ID matches profile", ok: norm(doc.nameOnId) === norm(member.fullName), detail: `ID says "${doc.nameOnId}"` },
    { key: "expiry", label: "Document is not expired", ok: !!doc.expiry && doc.expiry >= today, detail: doc.expiry ? `Expires ${doc.expiry}` : "No expiry date" },
    { key: "photo", label: "Photo and text are clear", ok: doc.photoClear !== false, detail: doc.photoClear === false ? "Marked unclear" : "Legible" },
    {
      key: "dup",
      label: "No other account uses this ID",
      ok: !allMembers.some((o) => o.id !== member.id && o.status !== "removed" && o.idRef && o.idRef === member.idRef),
      detail: "Checked against all accounts",
    },
  ];
}

export function matchBanned(text, words) {
  const t = (text || "").toLowerCase();
  return (words || []).filter((w) => w && t.includes(w.toLowerCase()));
}

export function audienceMatches(b, member) {
  const a = b.audience || { type: "all" };
  if (a.type === "all") return true;
  if (a.type === "city") return member.city === a.city;
  if (a.type === "youth") return !!member.isYouth;
  if (a.type === "verified") return member.verificationStatus === "verified";
  return true;
}
