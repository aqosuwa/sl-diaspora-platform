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
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="font-serif text-2xl font-bold text-charcoal">Log in</h1>
      <p className="mt-1 text-sm text-muted">Enter the email you registered with.</p>

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

      <div className="mt-8 rounded-xl border border-black/10 bg-sand/50 p-4">
        <p className="text-sm font-medium text-ink">Quick sign in</p>
        <p className="text-xs text-mute">Continue as an existing member.</p>
        <div className="mt-3 flex flex-col gap-2">
          {state.members.map((m) => (
            <button
              key={m.id}
              onClick={() => quickLogin(m.email)}
              className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 text-left text-sm hover:border-green/30 hover:bg-green-50"
            >
              <span>
                <span className="font-medium text-charcoal">{m.fullName}</span>{" "}
                <span className="text-muted">· {m.city}</span>
              </span>
              <span className="text-xs text-muted">{m.verificationStatus}</span>
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
  );
}
