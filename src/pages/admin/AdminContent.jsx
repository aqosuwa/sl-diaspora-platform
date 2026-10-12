import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { COUNTRIES, citiesFor } from "../../data/seed";
import AdminNav from "../../components/AdminNav";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { Field, Input, Select, Textarea } from "../../components/FormField";

const EVENT_CATEGORIES = ["Cultural", "Business", "Youth", "Community"];

const emptyEvent = {
  title: "",
  date: "",
  country: COUNTRIES[0],
  city: citiesFor(COUNTRIES[0])[0],
  category: EVENT_CATEGORIES[0],
  description: "",
};
const emptyNews = { title: "", excerpt: "" };

export default function AdminContent() {
  const { state, actions } = useApp();
  const [eventOpen, setEventOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [newsForm, setNewsForm] = useState(emptyNews);

  function handleEventSubmit(e) {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;
    actions.publishEvent(eventForm);
    setEventForm(emptyEvent);
    setEventOpen(false);
  }

  function handleNewsSubmit(e) {
    e.preventDefault();
    if (!newsForm.title) return;
    actions.publishNews(newsForm);
    setNewsForm(emptyNews);
    setNewsOpen(false);
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal">Events & News</h1>
            <p className="mt-1 text-sm text-muted">Publish community events and Commission announcements.</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-charcoal">Events</h2>
            <button
              onClick={() => setEventOpen(true)}
              className="rounded-lg bg-green px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-dark"
            >
              + Add Event
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {state.events.length === 0 ? (
              <EmptyState title="No events" />
            ) : (
              state.events.map((e) => (
                <Card key={e.id} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-charcoal">{e.title}</div>
                    <div className="text-xs text-muted">
                      {new Date(e.date).toLocaleDateString("en-GB")} · {e.city}, {e.country} · {e.category}
                    </div>
                  </div>
                  <button
                    onClick={() => actions.deleteEvent(e.id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-charcoal">News</h2>
            <button
              onClick={() => setNewsOpen(true)}
              className="rounded-lg bg-green px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-dark"
            >
              + Add News
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {state.news.length === 0 ? (
              <EmptyState title="No news items" />
            ) : (
              state.news.map((n) => (
                <Card key={n.id} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-charcoal">{n.title}</div>
                    <div className="text-xs text-muted">{new Date(n.date).toLocaleDateString("en-GB")}</div>
                  </div>
                  <button
                    onClick={() => actions.deleteNews(n.id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-10">
        <h2 className="font-serif text-lg font-semibold text-charcoal">Youth board</h2>
        <div className="mt-3 space-y-3">
          {(state.youthPosts || []).length === 0 ? (
            <EmptyState title="No youth board posts" />
          ) : (
            state.youthPosts.map((p) => (
              <Card key={p.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-charcoal">{p.title}</div>
                  <div className="text-xs text-muted">
                    {state.members.find((m) => m.id === p.memberId)?.fullName || "Member"} ·{" "}
                    {new Date(p.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>
                <button
                  onClick={() => actions.deleteYouthPost(p.id)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </Card>
            ))
          )}
        </div>
      </div>

      <Modal open={eventOpen} onClose={() => setEventOpen(false)} title="Add Event">
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <Field label="Title">
            <Input value={eventForm.title} onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Date">
            <Input type="date" value={eventForm.date} onChange={(e) => setEventForm((f) => ({ ...f, date: e.target.value }))} />
          </Field>
          <Field label="Country">
            <Select
              value={eventForm.country}
              onChange={(e) => {
                const country = e.target.value;
                setEventForm((f) => ({ ...f, country, city: citiesFor(country)[0] }));
              }}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="City">
            <Select value={eventForm.city} onChange={(e) => setEventForm((f) => ({ ...f, city: e.target.value }))}>
              {citiesFor(eventForm.country).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Category">
            <Select value={eventForm.category} onChange={(e) => setEventForm((f) => ({ ...f, category: e.target.value }))}>
              {EVENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Description">
            <Textarea rows={3} value={eventForm.description} onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))} />
          </Field>
          <button type="submit" className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-dark">
            Publish Event
          </button>
        </form>
      </Modal>

      <Modal open={newsOpen} onClose={() => setNewsOpen(false)} title="Add News Item">
        <form onSubmit={handleNewsSubmit} className="space-y-4">
          <Field label="Title">
            <Input value={newsForm.title} onChange={(e) => setNewsForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>
          <Field label="Excerpt">
            <Textarea rows={3} value={newsForm.excerpt} onChange={(e) => setNewsForm((f) => ({ ...f, excerpt: e.target.value }))} />
          </Field>
          <button type="submit" className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-dark">
            Publish News
          </button>
        </form>
      </Modal>
    </div>
  );
}
