// Field schemas that drive the dynamic Consular Services application forms.
// Each case type maps to an ordered list of fields. The form renderer in
// Consular.jsx reads this to build the right form for whatever type is
// selected, and the submitted answers are stored on the case as `details`.

export const CASE_TYPES = [
  "New Passport Application",
  "Passport Renewal",
  "National ID Renewal",
  "Visa Application",
  "Emergency Travel Certificate",
];

export const VISA_TYPES = ["Tourist", "Business", "Work", "Student", "Diplomatic"];
export const GENDERS = ["Female", "Male"];

const personal = [
  { key: "fullName", label: "Full legal name", type: "text", required: true },
  { key: "dob", label: "Date of birth", type: "date", required: true },
  { key: "placeOfBirth", label: "Place of birth", type: "text", required: true },
  { key: "gender", label: "Gender", type: "select", options: GENDERS, required: true },
];

export const CONSULAR_FORM_SCHEMAS = {
  "New Passport Application": [
    ...personal,
    { key: "fatherName", label: "Father's full name", type: "text", required: true },
    { key: "motherName", label: "Mother's full name", type: "text", required: true },
    { key: "currentAddress", label: "Current UK address", type: "textarea", required: true },
    { key: "contactPhone", label: "Contact phone number", type: "text", required: true },
    {
      key: "photoUploaded",
      label: "Passport photo",
      type: "checkbox",
      checkboxLabel: "I have a passport-standard photo ready to submit in person/by post",
    },
  ],
  "Passport Renewal": [
    { key: "fullName", label: "Full legal name (as on passport)", type: "text", required: true },
    { key: "oldPassportNumber", label: "Current passport number", type: "text", required: true },
    { key: "oldPassportExpiry", label: "Current passport expiry date", type: "date", required: true },
    { key: "dob", label: "Date of birth", type: "date", required: true },
    { key: "currentAddress", label: "Current UK address", type: "textarea", required: true },
    {
      key: "reasonForRenewal",
      label: "Reason for renewal",
      type: "select",
      options: ["Expiring soon", "Already expired", "Damaged", "Pages full", "Lost or stolen"],
      required: true,
    },
  ],
  "National ID Renewal": [
    { key: "fullName", label: "Full legal name (as on ID card)", type: "text", required: true },
    { key: "idNumber", label: "Current National ID number", type: "text", required: true },
    { key: "idExpiry", label: "Current ID expiry date", type: "date" },
    { key: "dob", label: "Date of birth", type: "date", required: true },
    { key: "placeOfBirth", label: "Place of birth", type: "text", required: true },
    { key: "currentAddress", label: "Current UK address", type: "textarea", required: true },
    { key: "contactPhone", label: "Contact phone number", type: "text", required: true },
    {
      key: "reasonForRenewal",
      label: "Reason for renewal",
      type: "select",
      options: ["Expiring soon", "Already expired", "Damaged", "Lost or stolen", "Change of details"],
      required: true,
    },
    {
      key: "collection",
      label: "Collection method",
      type: "select",
      options: ["Collect at the High Commission", "Post to my UK address"],
      required: true,
    },
    {
      key: "photoUploaded",
      label: "Photo",
      type: "checkbox",
      checkboxLabel: "I have a recent passport-standard photo ready to submit",
    },
  ],
  "Visa Application": [
    { key: "fullName", label: "Full legal name", type: "text", required: true },
    { key: "passportNumber", label: "Passport number", type: "text", required: true },
    { key: "visaType", label: "Visa type", type: "select", options: VISA_TYPES, required: true },
    { key: "travelPurpose", label: "Purpose of travel", type: "textarea", required: true },
    { key: "intendedArrivalDate", label: "Intended arrival date", type: "date", required: true },
    { key: "intendedDepartureDate", label: "Intended departure date", type: "date", required: true },
    { key: "destinationAddress", label: "Address while in Sierra Leone", type: "textarea", required: true },
  ],
  "Emergency Travel Certificate": [
    { key: "fullName", label: "Full legal name", type: "text", required: true },
    { key: "passportNumber", label: "Passport number (if known)", type: "text" },
    { key: "destination", label: "Destination", type: "text", required: true },
    { key: "intendedTravelDate", label: "Intended travel date", type: "date", required: true },
    {
      key: "reasonForEmergency",
      label: "Reason for emergency travel",
      type: "textarea",
      required: true,
      hint: "e.g. bereavement, urgent family matter, lost/stolen passport abroad",
    },
  ],
};
