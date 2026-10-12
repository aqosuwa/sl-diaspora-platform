import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import { JOB_CATEGORIES, UK_CITIES, COUNTRIES, citiesFor } from "../../data/seed";
import { PageHead, Tag, Confirm, smallBtn, dangerBtn, solidBtn, fmtDate } from "./ui";

const BIZ_CATS = ["Restaurant / Food", "Beauty & Hair", "Retail", "Professional Services", "Events & Catering", "Other"];

const KINDS = {
  job: {
    label: "Jobs", key: "jobs", noun: "job",
    blank: { title: "", company: "", city: UK_CITIES[0], category: JOB_CATEGORIES[0], type: "Full-time", salary: "", description: "", status: "published" },
    title: (x) => x.title, sub: (x) => `${x.company} · ${x.city} · ${x.status}`,
    fields: [
      ["title", "Job title", "text"], ["company", "Company", "text"],
      ["city", "City", "select", UK_CITIES], ["category", "Category", "select", JOB_CATEGORIES],
      ["type", "Type", "select", ["Full-time", "Part-time", "Contract", "Temporary"]],
      ["salary", "Salary", "text"], ["status", "Status", "select", ["published", "pending", "rejected"]],
      ["description", "Description", "area"],
    ],
    required: ["title", "company"],
  },
  business: {
    label: "Businesses", key: "businesses", noun: "business",
    blank: { name: "", category: BIZ_CATS[0], city: UK_CITIES[0], description: "", status: "published" },
    title: (x) => x.name, sub: (x) => `${x.category} · ${x.city} · ${x.status}`,
    fields: [
      ["name", "Business name", "text"], ["category", "Category", "select", BIZ_CATS], ["city", "City", "select", UK_CITIES],
      ["status", "Status", "select", ["published", "pending", "rejected"]], ["description", "Description", "area"],
    ],
    required: ["name"],
  },
  event: {
    label: "Events", key: "events", noun: "event",
    blank: { title: "", date: "", country: COUNTRIES[0], city: UK_CITIES[0], category: "Community", description: "" },
    title: (x) => x.title, sub: (x) => `${x.date ? fmtDate(x.date) : ""} · ${x.city}, ${x.country}`,
    fields: [
      ["title", "Title", "text"], ["date", "Date", "date"], ["country", "Country", "select", COUNTRIES],
      ["city", "City", "city"], ["category", "Category", "select", ["Cultural", "Business", "Youth", "Community"]],
      ["description", "Description", "area"],
    ],
    required: ["title", "date"],
  },
  news: {
    label: "News", key: "news", noun: "news",
    blank: { title: "", excerpt: "" },
    title: (x) => x.title, sub: (x) => (x.date ? fmtDate(x.date) : ""),
    fields: [["title", "Headline", "text"], ["excerpt", "Summary", "area"]],
    required: ["title", "excerpt"],
  },
};

function Listings({ kind }) {
  const { state, actions } = useApp();
  const K = KINDS[kind];
  const items = state[K.key] || [];
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [del, setDel] = useState(null);

  function save(e) {
    e.preventDefault();
    if (K.required.some((f) => !String(form[f] || "").trim())) {
      setError("Fill in the required fields.");
      return;
    }
    actions.saveListing(kind, form);
    setForm(null);
    setError("");
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} {K.label.toLowerCase()}</p>
        <button className="btn-primary !w-auto" onClick={() => { setForm({ ...K.blank }); setError(""); }}>Add {K.noun}</button>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? <EmptyState title={`No ${K.label.toLowerCase()}`} /> : items.map((x) => (
          <Card key={x.id} data-item={x.id} className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-charcoal">{K.title(x)}</div>
              <div className="text-xs text-muted">{K.sub(x)}</div>
              {x.status === "pending" && <div className="mt-1"><Tag tone="gold">Pending</Tag></div>}
            </div>
            <div className="flex gap-2">
              {x.status === "pending" && <button className={solidBtn} onClick={() => actions.saveListing(kind, { ...x, status: "published" })}>Approve</button>}
              <button className={smallBtn} onClick={() => { setForm({ ...x }); setError(""); }}>Edit</button>
              <button className={dangerBtn} onClick={() => setDel(x)}>Remove</button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? `Edit ${K.noun}` : `Add ${K.noun}`} wide>
        {form && (
          <form onSubmit={save} className="space-y-4">
            {K.fields.map(([f, label, type, opts]) => (
              <Field key={f} label={label}>
                {type === "select" ? (
                  <Select value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}>{opts.map((o) => <option key={o}>{o}</option>)}</Select>
                ) : type === "city" ? (
                  <Select value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}>
                    {[...new Set([form[f], ...citiesFor(form.country)])].filter(Boolean).map((o) => <option key={o}>{o}</option>)}
                  </Select>
                ) : type === "area" ? (
                  <Textarea rows={3} value={form[f] || ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
                ) : (
                  <Input type={type} value={form[f] || ""} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
                )}
              </Field>
            ))}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary w-full">Save {K.noun}</button>
          </form>
        )}
      </Modal>
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        title={`Remove ${K.noun}`}
        body={del ? `Remove "${K.title(del)}" from the site? This cannot be undone.` : ""}
        confirmLabel="Remove"
        danger
        onConfirm={() => { actions.removeListing(kind, del.id); setDel(null); }}
      />
    </div>
  );
}

function YouthPosts() {
  const { state, actions } = useApp();
  const [del, setDel] = useState(null);
  const posts = state.youthPosts || [];
  const nameFor = (id) => state.members.find((m) => m.id === id)?.fullName || "Member";
  return (
    <div className="space-y-3">
      {posts.length === 0 ? <EmptyState title="No youth posts" /> : posts.map((p) => (
        <Card key={p.id} data-item={p.id} className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold text-charcoal">{p.title}</div>
            <div className="text-xs text-muted">{nameFor(p.memberId)}</div>
            <p className="mt-1 text-sm text-charcoal/80">{p.body}</p>
          </div>
          <button className={dangerBtn} onClick={() => setDel(p)}>Remove</button>
        </Card>
      ))}
      <Confirm open={!!del} onClose={() => setDel(null)} title="Remove youth post" body={del ? `Remove "${del.title}"?` : ""} confirmLabel="Remove" danger
        onConfirm={() => { actions.removeListing("youth", del.id, "moderation"); setDel(null); }} />
    </div>
  );
}

function SiteSettings() {
  const { state, actions } = useApp();
  const s = state.siteSettings;
  const [banner, setBanner] = useState(s.banner);
  const [hero, setHero] = useState({ heroHeadline: s.heroHeadline, heroSub: s.heroSub, contactEmail: s.contactEmail });
  const [saved, setSaved] = useState("");
  const [faq, setFaq] = useState(null);
  const [word, setWord] = useState("");

  const flash = (m) => { setSaved(m); setTimeout(() => setSaved(""), 2500); };

  return (
    <div className="space-y-6">
      {saved && <p role="status" className="rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green">{saved}</p>}

      <Card>
        <h2 className="text-lg">Announcement banner</h2>
        <p className="text-sm text-muted">Shown in a gold strip at the top of every page.</p>
        <div className="mt-4 space-y-4">
          <Field label="Banner text"><Input value={banner.text} onChange={(e) => setBanner({ ...banner, text: e.target.value })} /></Field>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
            <input type="checkbox" checked={banner.active} onChange={(e) => setBanner({ ...banner, active: e.target.checked })} /> Show the banner on the site
          </label>
          <button className="btn-primary !w-auto" onClick={() => { actions.saveSiteSettings({ banner }, banner.active ? "Published the announcement banner" : "Saved the announcement banner (hidden)"); flash("Banner saved."); }}>Save banner</button>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg">Homepage and contact</h2>
        <div className="mt-4 space-y-4">
          <Field label="Homepage headline"><Textarea rows={2} value={hero.heroHeadline} onChange={(e) => setHero({ ...hero, heroHeadline: e.target.value })} /></Field>
          <Field label="Homepage intro"><Textarea rows={3} value={hero.heroSub} onChange={(e) => setHero({ ...hero, heroSub: e.target.value })} /></Field>
          <Field label="Contact email (footer)"><Input type="email" value={hero.contactEmail} onChange={(e) => setHero({ ...hero, contactEmail: e.target.value })} /></Field>
          <button className="btn-primary !w-auto" onClick={() => { actions.saveSiteSettings(hero, "Edited homepage text and contact email"); flash("Homepage saved."); }}>Save homepage</button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg">FAQs</h2>
          <button className={smallBtn} onClick={() => setFaq({ id: "", q: "", a: "" })}>Add question</button>
        </div>
        <div className="mt-3 divide-y divide-green-dark/10">
          {s.faqs.length === 0 && <p className="py-3 text-sm text-muted">No questions yet.</p>}
          {s.faqs.map((f) => (
            <div key={f.id} data-faq={f.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="font-semibold text-charcoal">{f.q}</div>
                <p className="text-sm text-charcoal/80">{f.a}</p>
              </div>
              <div className="flex gap-2">
                <button className={smallBtn} onClick={() => setFaq({ ...f })}>Edit</button>
                <button className={dangerBtn} onClick={() => actions.saveSiteSettings({ faqs: s.faqs.filter((x) => x.id !== f.id) }, `Removed FAQ "${f.q}"`)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg">Banned words and phrases</h2>
        <p className="text-sm text-muted">Chat messages containing any of these are flagged for review automatically.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {s.bannedWords.map((w) => (
            <span key={w} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-charcoal ring-1 ring-green-dark/10">
              {w}
              <button aria-label={`Remove ${w}`} className="text-muted hover:text-red-600" onClick={() => actions.saveSiteSettings({ bannedWords: s.bannedWords.filter((x) => x !== w) }, `Removed "${w}" from banned words`)}>✕</button>
            </span>
          ))}
        </div>
        <form className="mt-4 flex gap-2" onSubmit={(e) => {
          e.preventDefault();
          const w = word.trim().toLowerCase();
          if (!w || s.bannedWords.includes(w)) return;
          actions.saveSiteSettings({ bannedWords: [...s.bannedWords, w] }, `Added "${w}" to banned words`);
          setWord("");
        }}>
          <Input value={word} onChange={(e) => setWord(e.target.value)} placeholder="Add a word or phrase" aria-label="New banned word" />
          <button type="submit" className="btn-primary !w-auto flex-shrink-0">Add</button>
        </form>
      </Card>

      <Modal open={!!faq} onClose={() => setFaq(null)} title={faq?.id ? "Edit question" : "Add question"}>
        {faq && (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!faq.q.trim() || !faq.a.trim()) return;
            const next = faq.id
              ? s.faqs.map((x) => (x.id === faq.id ? { ...faq } : x))
              : [...s.faqs, { ...faq, id: `faq_${Date.now()}` }];
            actions.saveSiteSettings({ faqs: next }, `${faq.id ? "Edited" : "Added"} FAQ "${faq.q}"`);
            setFaq(null);
          }} className="space-y-4">
            <Field label="Question"><Input value={faq.q} onChange={(e) => setFaq({ ...faq, q: e.target.value })} /></Field>
            <Field label="Answer"><Textarea rows={4} value={faq.a} onChange={(e) => setFaq({ ...faq, a: e.target.value })} /></Field>
            <button type="submit" className="btn-primary w-full">Save question</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default function MasterContent() {
  const [tab, setTab] = useState("site");
  const tabs = [["site", "Site"], ["job", "Jobs"], ["business", "Businesses"], ["event", "Events"], ["news", "News"], ["youth", "Youth posts"]];
  return (
    <div>
      <PageHead title="Site content" sub="Edit what the public and members see. Changes go live immediately." />
      <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold ${tab === k ? "bg-green text-white" : "bg-white text-charcoal ring-1 ring-green-dark/[0.1] hover:bg-green-50"}`}>{l}</button>
        ))}
      </div>
      {tab === "site" && <SiteSettings />}
      {["job", "business", "event", "news"].includes(tab) && <Listings key={tab} kind={tab} />}
      {tab === "youth" && <YouthPosts />}
    </div>
  );
}
