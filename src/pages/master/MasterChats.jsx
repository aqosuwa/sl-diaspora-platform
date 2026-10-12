import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { Input } from "../../components/FormField";
import { CHAT_ROOMS } from "../../data/master";
import { PageHead, Tag, Confirm, smallBtn, dangerBtn, solidBtn, fmt } from "./ui";

export default function MasterChats() {
  const { state, actions } = useApp();
  const [tab, setTab] = useState("open");
  const [room, setRoom] = useState("general");
  const [act, setAct] = useState(null);
  const [opts, setOpts] = useState({ warn: false, mute: false, suspend: false });
  const [q, setQ] = useState("");

  const msgs = state.chatMessages || [];
  const nameFor = (id) => state.members.find((m) => m.id === id)?.fullName || "Member";
  const roomLabel = (k) => CHAT_ROOMS.find((r) => r.key === k)?.label || k;
  const open = msgs.filter((m) => m.flagged && m.modStatus === "open");
  const handled = msgs.filter((m) => m.flagged && m.modStatus !== "open");
  const browse = msgs.filter((m) => m.room === room && (!q.trim() || m.text.toLowerCase().includes(q.trim().toLowerCase())));
  const list = tab === "open" ? open : handled;
  const actMsg = act && msgs.find((m) => m.id === act);

  function context(m) {
    const inRoom = msgs.filter((x) => x.room === m.room).sort((a, b) => new Date(a.at) - new Date(b.at));
    const i = inRoom.findIndex((x) => x.id === m.id);
    return inRoom.slice(Math.max(0, i - 2), i + 3);
  }

  function run(decision) {
    actions.resolveChatFlag(act, decision, opts);
    setAct(null);
    setOpts({ warn: false, mute: false, suspend: false });
  }

  return (
    <div>
      <PageHead title="Chat moderation" sub="Messages are flagged by banned-word rules or by member reports." />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {[["open", `Flagged (${open.length})`], ["handled", `Handled (${handled.length})`], ["browse", "Browse all chats"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3.5 py-2 text-xs font-semibold ${tab === k ? "bg-green text-white" : "bg-white text-charcoal ring-1 ring-green-dark/[0.1] hover:bg-green-50"}`}>
            {l}
          </button>
        ))}
      </div>

      {tab !== "browse" && (
        <div className="space-y-4">
          {list.length === 0 ? (
            <EmptyState title={tab === "open" ? "No flagged messages" : "Nothing handled yet"} body={tab === "open" ? "The chat is clear right now." : "Reviewed flags will appear here."} />
          ) : (
            list.map((m) => (
              <Card key={m.id} data-flag={m.id}>
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone={m.flagSource === "auto" ? "blue" : "gold"}>{m.flagSource === "auto" ? "Auto-flagged" : "Reported by member"}</Tag>
                  <Tag>{roomLabel(m.room)}</Tag>
                  {tab === "handled" && <Tag tone={m.modStatus === "removed" ? "red" : "green"}>{m.modStatus === "removed" ? "Removed" : "Cleared"}</Tag>}
                </div>
                <p className="mt-3 text-sm text-muted">
                  <span className="font-semibold text-charcoal">{nameFor(m.memberId)}</span> · {fmt(m.at)}
                </p>
                <p className="mt-1 rounded-xl bg-cream p-3 text-sm text-charcoal">{m.text}</p>
                <p className="mt-2 text-xs text-muted">
                  Why: {m.flagReason}
                  {m.reportedBy && ` · reported by ${nameFor(m.reportedBy)}`}
                </p>
                <details className="mt-3 text-sm">
                  <summary className="cursor-pointer font-semibold text-green">Show conversation</summary>
                  <div className="mt-2 space-y-1.5 border-l-2 border-green-dark/10 pl-3">
                    {context(m).map((c) => (
                      <p key={c.id} className={`text-xs ${c.id === m.id ? "font-semibold text-red-700" : "text-charcoal/80"}`}>
                        <span className="font-semibold">{nameFor(c.memberId)}:</span> {c.modStatus === "removed" ? "[removed]" : c.text}
                      </p>
                    ))}
                  </div>
                </details>
                {tab === "open" && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-green-dark/10 pt-4">
                    <button className={smallBtn} onClick={() => actions.resolveChatFlag(m.id, "dismissed")}>Dismiss flag</button>
                    <button className={dangerBtn} onClick={() => { setAct(m.id); setOpts({ warn: false, mute: false, suspend: false }); }}>Take action</button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {tab === "browse" && (
        <div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-wrap gap-1.5">
              {CHAT_ROOMS.map((r) => (
                <button key={r.key} onClick={() => setRoom(r.key)} className={`rounded-full px-3.5 py-2 text-xs font-semibold ${room === r.key ? "bg-green-dark text-white" : "bg-white text-charcoal ring-1 ring-green-dark/[0.1]"}`}>{r.label}</button>
              ))}
            </div>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search messages" aria-label="Search messages" />
          </div>
          <div className="mt-4 space-y-2">
            {browse.length === 0 ? (
              <EmptyState title="No messages" />
            ) : (
              browse.map((m) => (
                <Card key={m.id} className="flex flex-wrap items-start justify-between gap-3 !p-4">
                  <div className="min-w-0">
                    <p className="text-xs text-muted"><span className="font-semibold text-charcoal">{nameFor(m.memberId)}</span> · {fmt(m.at)}</p>
                    <p className={`mt-1 break-words text-sm ${m.modStatus === "removed" ? "italic text-slate-400" : "text-charcoal"}`}>{m.modStatus === "removed" ? "[removed by moderator]" : m.text}</p>
                  </div>
                  {m.modStatus !== "removed" && (
                    <button className={dangerBtn} onClick={() => { setAct(m.id); setOpts({ warn: false, mute: false, suspend: false }); }}>Take action</button>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      <Confirm
        open={!!act}
        onClose={() => setAct(null)}
        title="Take action on this message"
        body={actMsg ? `"${actMsg.text.slice(0, 120)}${actMsg.text.length > 120 ? "…" : ""}" by ${nameFor(actMsg.memberId)}` : ""}
        confirmLabel="Remove message"
        danger
        onConfirm={() => run("removed")}
      >
        <div className="mt-4 space-y-2 text-sm">
          {[["warn", "Also warn the member"], ["mute", "Also mute them in chat"], ["suspend", "Also suspend their account"]].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} />
              {l}
            </label>
          ))}
        </div>
      </Confirm>
    </div>
  );
}
