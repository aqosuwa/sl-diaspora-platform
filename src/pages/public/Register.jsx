import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { UK_CITIES } from "../../data/seed";
import { Field, Input, Select } from "../../components/FormField";

export default function Register() {
  const { actions, state } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: UK_CITIES[0],
    isYouth: false,
    idRef: "",
  });
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.idRef) {
      setError("Please fill in your full name, email, and ID reference.");
      return;
    }
    const exists = state.members.some(
      (m) => m.email.toLowerCase() === form.email.toLowerCase()
    );
    if (exists) {
      setError("An account with this email already exists. Try logging in instead.");
      return;
    }
    actions.registerMember(form);
    navigate("/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <h1 className="font-serif text-2xl font-bold text-charcoal">Join the Platform</h1>
      <p className="mt-1 text-sm text-muted">
        Register as a member of the Sierra Leonean diaspora community in the UK.
        Your account starts as <span className="font-medium">pending verification</span>.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Full name">
          <Input
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="e.g. Aminata Kamara"
          />
        </Field>
        <Field label="Email address">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone number">
          <Input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+44 7700 900000"
          />
        </Field>
        <Field label="UK city">
          <Select value={form.city} onChange={(e) => update("city", e.target.value)}>
            {UK_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Sierra Leonean passport or ID reference"
          hint="Used by caseworkers to verify your identity."
        >
          <Input
            value={form.idRef}
            onChange={(e) => update("idRef", e.target.value)}
            placeholder="SL-PASS-000000"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={form.isYouth}
            onChange={(e) => update("isYouth", e.target.checked)}
            className="h-4 w-4 rounded border-black/20 text-green focus:ring-green"
          />
          I'm part of the youth community (under 30 / second-generation)
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Create Account
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-green hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
