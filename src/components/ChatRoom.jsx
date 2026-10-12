import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { REPORT_REASONS } from "../data/master";
import Modal from "./Modal";
import { Field, Select } from "./FormField";

export default function ChatRoom({ room, title, blurb, tall = false }) {
  const { state, actions, currentMember } = useApp();
  const [text, setText] = useState("");
  const [reporting, setReporting] = useState(null);
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [thanks, setThanks] = useState(false);
  const boxRef = useRef(null);

  const messages = (state.chatMessages || [])
    .filter((m) => m.room === room)
    .sort((a, b) => new Date(a.at) - new Date(b.at));
  const muted = !!currentMember.chatMuted;

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, room]);

  const nameFor = (id) => state.members.find((m) => m.id === id)?.fullName || "Member";

  function send(e) {
    e.preventDefault();
    if (!text.trim() || muted) return;
    actions.postChatMessage(currentMember.id, room, text);
    setText("");
  }

  function sendReport(e) {
    e.preventDefault();
    actions.reportChatMessage(reporting.id, currentMember.id, reason);
    setThanks(true);
  }

  return (
    <div className={`flex ${tall ? "min-h-[30rem]" : "min-h-[28rem]"} flex-col rounded-2xl bg-white shadow-card ring-1 ring-green-dark/[0.06]`}>
      <div className="border-b border-green-dark/10 px-5 py-3">
        <h2 className="font-serif text-lg font-semibold text-charcoal">{title}</h2>
        <p className="text-xs text-muted">{blurb}</p>
      </div>
<div ref={boxRef} className="max-h-[26rem] flex-1 space-y-4 overflow-y-auto px-5 py-4" aria-live="polite">
            {messages.length === 0 && <p className="text-sm text-muted">No messages yet. Start the conversation.</p>}
            {messages.map((m) => {
              const mine = m.memberId === currentMember.id;
              const removed = m.modStatus === "removed";
              return (
                <div key={m.id} data-msg={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                  <span className="text-xs text-muted">
                    {mine ? "You" : nameFor(m.memberId)} · {new Date(m.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {removed ? (
                    <p className="mt-1 rounded-2xl bg-slate-100 px-3.5 py-2 text-sm italic text-slate-500">Message removed by a moderator</p>
                  ) : (
                    <p className={`mt-1 max-w-[85%] break-words rounded-2xl px-3.5 py-2 text-sm ${mine ? "bg-green text-white" : "bg-cream text-charcoal"}`}>{m.text}</p>
                  )}
                  {!mine && !removed && (
                    <button
                      onClick={() => {
                        setReporting(m);
                        setThanks(false);
                        setReason(REPORT_REASONS[0]);
                      }}
                      className="mt-0.5 text-xs text-muted underline-offset-2 hover:text-red-600 hover:underline"
                    >
                      {m.reportedBy === currentMember.id ? "Reported" : "Report"}
                    </button>
                  )}
                </div>
              );
            })}
            
          </div>
          {muted ? (
            <p className="border-t border-green-dark/10 bg-red-50 px-5 py-3 text-sm text-red-700">
              You can read messages but cannot post right now. Contact the High Commission if you think this is a mistake.
            </p>
          ) : (
            <form onSubmit={send} className="flex gap-2 border-t border-green-dark/10 p-3">
              <label className="sr-only" htmlFor="chat-input">Message</label>
              <input
                id="chat-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Message ${title}`}
                className="min-w-0 flex-1 rounded-full border-[1.5px] border-green-dark/15 px-4 py-2.5 text-sm outline-none focus:border-green focus:ring-4 focus:ring-green/10"
              />
              <button type="submit" disabled={!text.trim()} className="btn-primary !w-auto flex-shrink-0 disabled:opacity-50">
                Send
              </button>
            </form>
          )}

      <Modal open={!!reporting} onClose={() => setReporting(null)} title={thanks ? "Report sent" : "Report this message"}>
        {thanks ? (
          <div>
            <p className="text-sm text-charcoal">Thank you. A moderator will review the message.</p>
            <button onClick={() => setReporting(null)} className="btn-primary mt-5 w-full">Close</button>
          </div>
        ) : (
          <form onSubmit={sendReport} className="space-y-4">
            <p className="rounded-xl bg-cream p-3 text-sm text-charcoal">&ldquo;{reporting?.text}&rdquo;</p>
            <Field label="What is wrong?">
              <Select value={reason} onChange={(e) => setReason(e.target.value)}>
                {REPORT_REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <button type="submit" className="btn-primary w-full">Send report</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
