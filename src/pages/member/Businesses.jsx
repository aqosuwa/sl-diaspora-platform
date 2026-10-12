import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { UK_CITIES } from "../../data/seed";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { Field, Input, Select, Textarea } from "../../components/FormField";

const CATEGORIES = [
  "Restaurant / Food",
  "Beauty & Hair",
  "Retail",
  "Professional Services",
  "Events & Catering",
  "Other",
];

const emptyBiz = { name: "", category: CATEGORIES[0], city: UK_CITIES[0], description: "" };

export default function Businesses() {
  const { state, actions, currentMember } = useApp();
  const [cityFilter, setCityFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyBiz);

  const published = useMemo(
    () =>
      state.businesses
        .filter((b) => b.status === "published")
        .filter((b) => cityFilter === "All" || b.city === cityFilter),
    [state.businesses, cityFilter]
  );

  const myListed = state.businesses.filter((b) => b.postedBy === currentMember.id);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name) return;
    actions.postBusiness({ ...form, postedBy: currentMember.id });
    setForm(emptyBiz);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Business Directory</h1>
          <p className="mt-1 text-sm text-muted">Sierra Leonean-owned businesses across the UK.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn-primary"
        >
          + List Your Business
        </button>
      </div>

      <div className="mt-6">
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        >
          <option value="All">All cities</option>
          {UK_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {published.length === 0 ? (
          <EmptyState title="No businesses in this city yet" />
        ) : (
          published.map((b) => (
            <Card key={b.id}>
              <h3 className="font-serif text-lg font-semibold text-charcoal">{b.name}</h3>
              <p className="text-sm text-muted">
                {b.category} · {b.city}
              </p>
              <p className="mt-2 text-sm text-charcoal/80">{b.description}</p>
            </Card>
          ))
        )}
      </div>

      {myListed.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Your Listings</h2>
          <div className="mt-3 space-y-3">
            {myListed.map((b) => (
              <Card key={b.id} className="flex items-center justify-between">
                <div className="font-medium text-charcoal">{b.name}</div>
                <StatusPill status={b.status} />
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="List Your Business">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Business name">
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={(e) => update("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="City">
            <Select value={form.city} onChange={(e) => update("city", e.target.value)}>
              {UK_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Description">
            <Textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
          </Field>
          <p className="text-xs text-muted">
            Your listing will be reviewed by Commission staff before it goes live.
          </p>
          <button
            type="submit"
            className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-dark"
          >
            Submit for Review
          </button>
        </form>
      </Modal>
    </div>
  );
}
