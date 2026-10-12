import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import { Field, Input, Textarea } from "../../components/FormField";
import ChatRoom from "../../components/ChatRoom";

export default function Youth() {
  const { state, actions, currentMember } = useApp();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const posts = [...(state.youthPosts || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const youthEvents = state.events
    .filter((e) => e.category === "Youth")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  function nameFor(id) {
    return state.members.find((m) => m.id === id)?.fullName || "Member";
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Add a title and a message before posting.");
      return;
    }
    actions.addYouthPost(currentMember.id, { title: title.trim(), body: body.trim() });
    setTitle("");
    setBody("");
    setError("");
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Youth connection</h1>
          <p className="mt-1 text-sm text-muted">
            Ask for mentorship, share ideas, and find events for second-generation members.
          </p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary">
          New post
        </button>
      </div>

      <div className="mt-8">
        <ChatRoom
          room="youth"
          title="Youth group chat"
          blurb="One shared space for young members to chat, ask questions and make plans together."
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Community board</h2>
          <div className="mt-4 space-y-4">
            {posts.length === 0 ? (
              <EmptyState title="No posts yet" body="Start the conversation with a new post." />
            ) : (
              posts.map((p) => (
                <Card key={p.id}>
                  <h3 className="font-serif text-base font-semibold text-charcoal">{p.title}</h3>
                  <p className="text-xs text-muted">
                    {nameFor(p.memberId)} · {new Date(p.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  <p className="mt-2 text-sm text-charcoal/80">{p.body}</p>
                  {p.memberId === currentMember.id && (
                    <button
                      onClick={() => actions.deleteYouthPost(p.id)}
                      className="mt-3 text-xs font-medium text-red-600 hover:underline"
                    >
                      Delete my post
                    </button>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Youth events</h2>
          <div className="mt-4 space-y-4">
            {youthEvents.length === 0 ? (
              <EmptyState title="No youth events scheduled" />
            ) : (
              youthEvents.map((e) => (
                <Card key={e.id}>
                  <p className="text-xs text-muted">
                    {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {e.city}
                  </p>
                  <h3 className="mt-1 font-serif text-base font-semibold text-charcoal">{e.title}</h3>
                  <p className="mt-1 text-sm text-charcoal/80">{e.description}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New post">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Message">
            <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Post to the board
          </button>
        </form>
      </Modal>
    </div>
  );
}
