import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Field, Input } from "../../components/FormField";

export default function Login() {
  const { actions, state } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const found = actions.login(email);
    if (!found) {
      setError("No account found with that email. Check the address, or register a new account.");
      return;
    }
    navigate("/dashboard");
  }

  function quickLogin(memberEmail) {
    actions.login(memberEmail);
    navigate("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16">
    <div className="rounded-3xl bg-white p-6 shadow-lift ring-1 ring-green-dark/[0.06] sm:p-9">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in with the email you registered with.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Email address">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Log in
        </button>
      </form>

      <div className="mt-8 rounded-2xl bg-cream p-4">
        <p className="text-sm font-medium text-ink">Quick sign in</p>
        <p className="text-xs text-mute">Continue as an existing member.</p>
        <div className="mt-3 flex flex-col gap-2">
          {state.members.map((m) => (
            <button
              key={m.id}
              onClick={() => quickLogin(m.email)}
              className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-left text-sm shadow-card ring-1 ring-green-dark/[0.06] transition hover:bg-green-50 hover:ring-green/30"
            >
              <span>
                <span className="font-medium text-charcoal">{m.fullName}</span>{" "}
                <span className="text-muted">· {m.city}</span>
              </span>
              <span className="flex-shrink-0 whitespace-nowrap pl-2 text-xs text-muted">{m.verificationStatus}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-muted">
        New here?{" "}
        <Link to="/register" className="font-medium text-green hover:underline">
          Create an account
        </Link>
      </p>
    </div>
    </div>
  );
}
