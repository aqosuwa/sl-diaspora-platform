import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import { UK_CITIES } from "../../data/seed";
import { audienceMatches } from "../../data/master";
import { PageHead, Tag, dangerBtn, fmt } from "./ui";

export default function MasterBroadcast() {
  const { state, actions } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("all");
  const [city, setCity] = useState(UK_CITIES[0]);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  const audience = type === "city" ? { type, city } : { type };
  const reach = state.members.filter((m) => m.status !== "removed" && m.status !== "suspended" && audienceMatches({ audience }, m)).length;
  const label = (a) => (a.type === "city" ? `Members in ${a.city}` : { all: "All members", youth: "Youth members", verified: "Verified members" }[a.type]);

  function submit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Add a title and a message.");
      return;
    }
    actions.sendBroadcast({ title: title.trim(), body: body.trim(), audience });
    setSent(`Sent to ${reach} member${reach === 1 ? "" : "s"}.`);
    setTitle("");
    setBody("");
    setError("");
  }

  return (
    <div>
      <PageHead title="Broadcasts" sub="Notices appear at the top of each targeted member's dashboard." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg">New broadcast</h2>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Passport office closed on 27 April" /></Field>
            <Field label="Message"><Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} /></Field>
            <Field label="Send to">
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="all">All members</option>
                <option value="verified">Verified members only</option>
                <option value="youth">Youth members</option>
                <option value="city">Members in one city</option>
              </Select>
            </Field>
            {type === "city" && (
              <Field label="City"><Select value={city} onChange={(e) => setCity(e.target.value)}>{UK_CITIES.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            )}
            <p className="text-xs text-muted">This will reach {reach} member{reach === 1 ? "" : "s"}.</p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {sent && <p className="text-sm text-green" role="status">{sent}</p>}
            <button type="submit" className="btn-primary w-full">Send broadcast</button>
          </form>
        </Card>
        <div>
          <h2 className="mb-3 text-lg">Sent</h2>
          <div className="space-y-3">
            {(state.broadcasts || []).length === 0 ? (
              <EmptyState title="Nothing sent yet" />
            ) : (
              state.broadcasts.map((b) => (
                <Card key={b.id} data-broadcast={b.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base">{b.title}</h3>
                      <p className="mt-1 text-sm text-charcoal/80">{b.body}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted"><Tag tone="blue">{label(b.audience)}</Tag>{fmt(b.at)}</div>
                    </div>
                    <button className={dangerBtn} onClick={() => actions.deleteBroadcast(b.id)}>Delete</button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
