// Dummy seed data for the SL Diaspora Platform prototype.
// Nothing here touches a real backend — it's loaded into AppContext
// and mutated/persisted to localStorage from there.

export const REFERRAL_CATEGORIES = [
  "Immigration Lawyer",
  "Family Lawyer",
  "GP / Doctor",
  "Mental Health / Therapist",
  "Accountant",
  "Other",
];

export const JOB_CATEGORIES = [
  "Healthcare",
  "Hospitality",
  "Transport & Logistics",
  "Admin & Office",
  "Retail",
  "Construction & Trades",
  "Education",
  "IT & Tech",
];

export const UK_CITIES = [
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
  "Bristol",
  "Glasgow",
  "Sheffield",
  "Coventry",
];

export const SL_CITIES = ["Freetown", "Bo", "Kenema", "Makeni", "Koidu", "Waterloo"];

export const COUNTRIES = ["United Kingdom", "Sierra Leone"];

export function citiesFor(country) {
  return country === "Sierra Leone" ? SL_CITIES : UK_CITIES;
}

export const seedMembers = [
  {
    id: "mem_1",
    fullName: "Aminata Kamara",
    email: "aminata.kamara@example.com",
    city: "London",
    phone: "+44 7700 900111",
    isYouth: false,
    isProfessional: false,
    verificationStatus: "verified",
    joinedAt: "2026-07-02T09:00:00.000Z",
    idRef: "SL-PASS-884213",
  },
  {
    id: "mem_2",
    fullName: "Mohamed Bangura",
    email: "m.bangura@example.com",
    city: "Manchester",
    phone: "+44 7700 900222",
    isYouth: true,
    isProfessional: false,
    verificationStatus: "verified",
    joinedAt: "2026-08-11T09:00:00.000Z",
    idRef: "SL-PASS-991022",
  },
  {
    id: "mem_3",
    fullName: "Fatmata Sesay",
    email: "fatmata.sesay@example.com",
    city: "Birmingham",
    phone: "+44 7700 900333",
    isYouth: false,
    isProfessional: false,
    verificationStatus: "pending",
    joinedAt: "2026-10-01T09:00:00.000Z",
    idRef: "SL-PASS-110983",
  },
];

export const seedProfessionals = [
  {
    id: "pro_1",
    fullName: "Barrister Ibrahim Koroma",
    category: "Immigration Lawyer",
    firm: "Koroma & Associates",
    city: "London",
    country: "United Kingdom",
    bio: "15 years practising UK immigration and asylum law; works regularly with the SL diaspora community.",
    verificationStatus: "verified",
    availability: "available",
  },
  {
    id: "pro_2",
    fullName: "Dr. Isata Conteh",
    category: "GP / Doctor",
    firm: "Conteh Family Practice",
    city: "Manchester",
    country: "United Kingdom",
    bio: "NHS GP with a special interest in diaspora and migrant health.",
    verificationStatus: "verified",
    availability: "available",
  },
  {
    id: "pro_3",
    fullName: "Abu Bakarr Jalloh",
    category: "Accountant",
    firm: "Jalloh Accounting Services",
    city: "London",
    country: "United Kingdom",
    bio: "Chartered accountant supporting diaspora-owned small businesses and self-assessment filings.",
    verificationStatus: "verified",
    availability: "available",
  },
  {
    id: "pro_4",
    fullName: "Yeama Thorlu-Bangura",
    category: "Family Lawyer",
    firm: "Thorlu-Bangura Legal",
    city: "Birmingham",
    country: "United Kingdom",
    bio: "Family law solicitor handling divorce, custody, and domestic matters.",
    verificationStatus: "verified",
    availability: "limited",
  },
  {
    id: "pro_5",
    fullName: "Dr. Musu Fofanah",
    category: "Mental Health / Therapist",
    firm: "Fofanah Wellbeing Practice",
    city: "London",
    country: "United Kingdom",
    bio: "Counselling psychologist with experience supporting diaspora and resettlement-related stress.",
    verificationStatus: "pending",
    availability: "available",
  },
  {
    id: "pro_6",
    fullName: "Dr. Alhaji Turay",
    category: "GP / Doctor",
    firm: "Turay Medical Clinic",
    city: "Freetown",
    country: "Sierra Leone",
    bio: "General practitioner in Freetown supporting diaspora members with family healthcare needs back home.",
    verificationStatus: "verified",
    availability: "available",
  },
  {
    id: "pro_7",
    fullName: "Solicitor Hawa Kargbo",
    category: "Family Lawyer",
    firm: "Kargbo Chambers",
    city: "Freetown",
    country: "Sierra Leone",
    bio: "Handles land, inheritance, and family matters in Sierra Leone for diaspora clients abroad.",
    verificationStatus: "verified",
    availability: "available",
  },
  {
    id: "pro_8",
    fullName: "Mohamed Lamin Kamara",
    category: "Accountant",
    firm: "Kamara & Partners Accounting",
    city: "Bo",
    country: "Sierra Leone",
    bio: "Chartered accountant supporting diaspora-owned property and business interests in Sierra Leone.",
    verificationStatus: "pending",
    availability: "available",
  },
];

export const seedJobs = [
  {
    id: "job_1",
    title: "Registered Nurse — Elderly Care",
    company: "Riverside Care Home",
    city: "London",
    category: "Healthcare",
    type: "Full-time",
    salary: "£28,000–£34,000",
    postedAt: "2026-09-20T09:00:00.000Z",
    status: "published",
    description:
      "Riverside Care Home is looking for a registered nurse to join our elderly care team. NMC registration required.",
  },
  {
    id: "job_2",
    title: "Warehouse Operative",
    company: "Northgate Logistics",
    city: "Manchester",
    category: "Transport & Logistics",
    type: "Full-time",
    salary: "£11.50/hr",
    postedAt: "2026-09-25T09:00:00.000Z",
    status: "published",
    description:
      "Picking, packing and loading in a fast-paced distribution centre. Immediate start available.",
  },
  {
    id: "job_3",
    title: "Front Desk Administrator",
    company: "Crescent Medical Centre",
    city: "Birmingham",
    category: "Admin & Office",
    type: "Part-time",
    salary: "£10.90/hr",
    postedAt: "2026-10-02T09:00:00.000Z",
    status: "published",
    description:
      "Reception and admin support for a busy GP practice. Customer service experience preferred.",
  },
  {
    id: "job_4",
    title: "Hotel Night Porter",
    company: "The Albany Hotel",
    city: "Leeds",
    category: "Hospitality",
    type: "Part-time",
    salary: "£11.20/hr",
    postedAt: "2026-10-05T09:00:00.000Z",
    status: "pending",
    description:
      "Overnight porter cover for a boutique city-centre hotel. Weekend availability required.",
  },
];

export const seedBusinesses = [
  {
    id: "biz_1",
    name: "Freetown Kitchen",
    category: "Restaurant / Food",
    city: "London",
    description: "Authentic Sierra Leonean cuisine — cassava leaves, jollof, and grilled fish.",
    status: "published",
  },
  {
    id: "biz_2",
    name: "Salone Hair & Beauty",
    category: "Beauty & Hair",
    city: "Manchester",
    description: "Braiding, natural hair care, and beauty treatments.",
    status: "published",
  },
  {
    id: "biz_3",
    name: "Kono Gold Imports",
    category: "Retail",
    city: "Birmingham",
    description: "West African groceries, fabrics, and imported goods.",
    status: "pending",
  },
];

export const seedConsularCases = [
  {
    id: "case_1",
    memberId: "mem_1",
    type: "Passport Renewal",
    caseRef: "PSP-2026-4821",
    status: "Processing",
    submittedAt: "2026-09-10T09:00:00.000Z",
    payment: {
      method: "orange",
      methodName: "Orange Money",
      amount: 95,
      currency: "GBP",
      receiptNo: "RCT-2026-482100",
      paidAt: "2026-09-10T09:02:00.000Z",
      status: "Paid",
      detail: "Orange Money ••• 456",
    },
    timeline: [
      { status: "Submitted", at: "2026-09-10T09:00:00.000Z", note: "Application received. Payment of £95.00 confirmed (RCT-2026-482100)." },
      { status: "Under Review", at: "2026-09-14T09:00:00.000Z", note: "Documents checked." },
      { status: "Processing", at: "2026-09-21T09:00:00.000Z", note: "Sent to Freetown for issuance." },
    ],
  },
];

export const seedReferrals = [
  {
    id: "ref_1",
    memberId: "mem_1",
    category: "Immigration Lawyer",
    country: "United Kingdom",
    description: "Need advice on renewing indefinite leave to remain documentation.",
    status: "Matched",
    submittedAt: "2026-09-05T09:00:00.000Z",
    matchedProfessionalId: "pro_1",
    timeline: [
      { status: "Submitted", at: "2026-09-05T09:00:00.000Z", note: "Request received." },
      { status: "Caseworker Review", at: "2026-09-06T09:00:00.000Z", note: "Reviewed by caseworker." },
      { status: "Matched", at: "2026-09-08T09:00:00.000Z", note: "Matched to Barrister Ibrahim Koroma." },
    ],
  },
];

export const seedEvents = [
  {
    id: "evt_1",
    title: "Sierra Leone Independence Day Celebration",
    date: "2027-04-27",
    city: "London",
    country: "United Kingdom",
    category: "Cultural",
    description: "Community celebration marking Sierra Leone's Independence Day — music, food, and cultural displays.",
  },
  {
    id: "evt_2",
    title: "Diaspora Business & Investment Forum",
    date: "2026-11-14",
    city: "Manchester",
    country: "United Kingdom",
    category: "Business",
    description: "A forum connecting UK-based diaspora entrepreneurs with investment opportunities back home.",
  },
  {
    id: "evt_3",
    title: "Krio Language & Culture Evening",
    date: "2026-11-29",
    city: "Birmingham",
    country: "United Kingdom",
    category: "Youth",
    description: "An evening of Krio language basics, storytelling, and music for second-generation youth.",
  },
  {
    id: "evt_4",
    title: "Diaspora Homecoming Festival",
    date: "2026-12-18",
    city: "Freetown",
    country: "Sierra Leone",
    category: "Cultural",
    description: "An annual homecoming festival welcoming diaspora families back for the holiday season — music, food, and heritage tours.",
  },
  {
    id: "evt_5",
    title: "Diaspora Investment & Land Summit",
    date: "2027-02-20",
    city: "Freetown",
    country: "Sierra Leone",
    category: "Business",
    description: "A summit on land acquisition, property law, and investment opportunities for diaspora members looking to build or invest back home.",
  },
];

export const seedYouthPosts = [
  {
    id: "yp_1",
    memberId: "mem_2",
    title: "Looking for a mentor in engineering",
    body: "Second-year student in Manchester. Would love to hear from anyone working in engineering or tech about how they got started.",
    createdAt: "2026-10-03T10:00:00.000Z",
  },
  {
    id: "yp_2",
    memberId: "mem_1",
    title: "Krio conversation group — who's in?",
    body: "Thinking of starting a casual weekly Krio conversation group online so younger members can practise. Reply if you'd join.",
    createdAt: "2026-10-06T18:30:00.000Z",
  },
];

export const seedNews = [
  {
    id: "news_1",
    title: "Commission extends passport renewal processing hours",
    date: "2026-10-01",
    excerpt:
      "To reduce backlog, the Commission has extended processing hours for passport renewal applications submitted through the platform.",
  },
  {
    id: "news_2",
    title: "New verified business directory now open for applications",
    date: "2026-09-18",
    excerpt:
      "SL-owned businesses across the UK can now apply to be listed in the platform's verified business directory.",
  },
];
