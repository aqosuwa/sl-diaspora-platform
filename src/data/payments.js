// Fee schedule and payment methods for consular services.

export const FEES = {
  "New Passport Application": 120,
  "Passport Renewal": 95,
  "National ID Renewal": 45,
  "Visa Application": 60,
  "Emergency Travel Certificate": 50,
};

// Indicative rate used to show the Leone equivalent for mobile money payments.
export const SLE_PER_GBP = 29;

export const PAYMENT_METHODS = [
  {
    id: "orange",
    name: "Orange Money",
    kind: "mobile",
    blurb: "Pay from your Orange Money wallet",
    color: "#ff7900",
    prefixHint: "+232 76 / 77 / 78 / 79 …",
  },
  {
    id: "afrimoney",
    name: "Afrimoney",
    kind: "mobile",
    blurb: "Pay from your Africell Afrimoney wallet",
    color: "#7b2d8e",
    prefixHint: "+232 30 / 33 / 88 / 99 …",
  },
  {
    id: "card",
    name: "Visa / Mastercard",
    kind: "card",
    blurb: "Debit or credit card, UK or international",
    color: "#1a1f71",
  },
  {
    id: "bank",
    name: "Bank transfer",
    kind: "bank",
    blurb: "UK Faster Payments or BACS — confirmed by staff",
    color: "#0b5132",
  },
];

export const BANK_DETAILS = {
  accountName: "Sierra Leone High Commission Consular Fees",
  sortCode: "40-05-30",
  accountNumber: "41820593",
  bank: "Barclays Bank UK",
};

export const gbp = (n) => `£${Number(n).toFixed(2)}`;
export const sle = (n) => `Le ${Math.round(n * SLE_PER_GBP).toLocaleString("en-GB")}`;

export function makeReceiptNo() {
  return `RCT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function methodById(id) {
  return PAYMENT_METHODS.find((m) => m.id === id);
}

export function cardBrand(number) {
  const n = number.replace(/\D/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  return "";
}
