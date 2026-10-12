import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { JOB_CATEGORIES, UK_CITIES } from "../../data/seed";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { Field, Input, Select, Textarea } from "../../components/FormField";

const emptyJob = {
  title: "",
  company: "",
  city: UK_CITIES[0],
  category: JOB_CATEGORIES[0],
  type: "Full-time",
  salary: "",
  description: "",
};

export default function Jobs() {
  const { state, actions, currentMember } = useApp();
  const [cityFilter, setCityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyJob);

  const published = useMemo(
    () =>
      state.jobs
        .filter((j) => j.status === "published")
        .filter((j) => cityFilter === "All" || j.city === cityFilter)
        .filter((j) => categoryFilter === "All" || j.category === categoryFilter)
        .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)),
    [state.jobs, cityFilter, categoryFilter]
  );

  const myPosted = state.jobs.filter((j) => j.postedBy === currentMember.id);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handlePost(e) {
    e.preventDefault();
    if (!form.title || !form.company) return;
    actions.postJob({ ...form, postedBy: currentMember.id });
    setForm(emptyJob);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Jobs Board</h1>
          <p className="mt-1 text-sm text-muted">Vetted opportunities across the UK.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn-primary"
        >
          + Post a Job
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
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
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm"
        >
          <option value="All">All categories</option>
          {JOB_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {published.length === 0 ? (
          <EmptyState title="No jobs match these filters" body="Try a different city or category." />
        ) : (
          published.map((j) => {
            const applied = j.applicants?.includes(currentMember.id);
            return (
              <Card key={j.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal">{j.title}</h3>
                    <p className="text-sm text-muted">
                      {j.company} · {j.city} · {j.type}
                    </p>
                    <p className="mt-2 text-sm text-charcoal/80">{j.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-charcoal">
                        {j.category}
                      </span>
                      {j.salary && (
                        <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-charcoal">
                          {j.salary}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={applied}
                    onClick={() => actions.applyToJob(j.id, currentMember.id)}
                    className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition ${
                      applied
                        ? "cursor-not-allowed bg-green-50 text-green"
                        : "bg-green text-white hover:bg-green-dark"
                    }`}
                  >
                    {applied ? "Applied ✓" : "Apply"}
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {myPosted.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Jobs You've Posted</h2>
          <div className="mt-3 space-y-3">
            {myPosted.map((j) => (
              <Card key={j.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-charcoal">{j.title}</div>
                  <div className="text-xs text-muted">
                    {j.applicants?.length || 0} applicant(s)
                  </div>
                </div>
                <StatusPill status={j.status} />
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Post a Job" wide>
        <form onSubmit={handlePost} className="grid gap-4 sm:grid-cols-2">
          <Field label="Job title">
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
          </Field>
          <Field label="Company">
            <Input value={form.company} onChange={(e) => update("company", e.target.value)} />
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
          <Field label="Category">
            <Select value={form.category} onChange={(e) => update("category", e.target.value)}>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Employment type">
            <Select value={form.type} onChange={(e) => update("type", e.target.value)}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </Select>
          </Field>
          <Field label="Salary (optional)">
            <Input value={form.salary} onChange={(e) => update("salary", e.target.value)} placeholder="£25,000–£30,000" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <Textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <p className="mb-2 text-xs text-muted">
              Your listing will be reviewed by Commission staff before it appears on the board.
            </p>
            <button
              type="submit"
              className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-dark"
            >
              Submit for Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
