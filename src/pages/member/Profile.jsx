import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { UK_CITIES } from "../../data/seed";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import { Field, Input, Select } from "../../components/FormField";

export default function Profile() {
  const { currentMember, actions } = useApp();
  const [phone, setPhone] = useState(currentMember.phone);
  const [city, setCity] = useState(currentMember.city);
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    actions.updateMemberProfile?.(currentMember.id, { phone, city });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-charcoal">My Profile</h1>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-lg font-semibold text-charcoal">
              {currentMember.fullName}
            </p>
            <p className="text-sm text-muted">{currentMember.email}</p>
          </div>
          <StatusPill status={currentMember.verificationStatus} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted">ID reference</dt>
            <dd className="font-medium text-charcoal">{currentMember.idRef}</dd>
          </div>
          <div>
            <dt className="text-muted">Joined</dt>
            <dd className="font-medium text-charcoal">
              {new Date(currentMember.joinedAt).toLocaleDateString("en-GB")}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Youth community</dt>
            <dd className="font-medium text-charcoal">{currentMember.isYouth ? "Yes" : "No"}</dd>
          </div>
        </dl>
      </Card>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <Card>
          <h2 className="font-serif text-base font-semibold text-charcoal">Contact Details</h2>
          <div className="mt-4 space-y-4">
            <Field label="Phone number">
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="City">
              <Select value={city} onChange={(e) => setCity(e.target.value)}>
                {UK_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Card>
        <button
          type="submit"
          className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-dark"
        >
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
