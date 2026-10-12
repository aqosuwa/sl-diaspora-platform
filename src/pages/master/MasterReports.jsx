import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { Field, Select, Input } from "../../components/FormField";
import { PageHead, Tag, Confirm, smallBtn, solidBtn, fmt } from "./ui";

export default function MasterReports() {
  const { state, actions } = useApp();
  const [tab, setTab] = useState("open");
  const [dlg, setDlg] = useState(null);
  const [choice, setChoice] = useState("");
  const [note, setNote] = useState("");

  const all = state.reports || [];
  const list = all.filter((r) => (tab === "open" ? r.status === "open" : r.status !== "open"));
  const nameFor = (id) => state.members.find((m) => m.id === id)?.fullName || "Member";

  function describe(r) {
    if (r.kind === "job") {
      const j = state.jobs.find((x) => x.id === r.targetId);
      return j ? `${j.title}, ${j.company}` : "Job (already removed)";
    }
    if (r.kind === "business") {
      const b = state.businesses.find((x) => x.id === r.targetId);
      return b ? b.name : "Business (already removed)";
    }
    if (r.kind === "member") return nameFor(r.targetId);
    return r.targetId;
  }
  const exists = (r) =>
    (r.kind === "job" && state.jobs.some((x) => x.id === r.targetId)) ||
    (r.kind === "business" && state.businesses.some((x) => x.id === r.targetId)) ||
    r.kind === "member";

  function options(r) {
    const o = [];
    if (r.kind === "job" && exists(r)) o.push(["remove", "Remove the job listing"]);
    if (r.kind === "business" && exists(r)) o.push(["remove", "Remove the business listing"]);
    if (r.kind === "member") {
      o.push(["warn", "Mute member in chat"], ["suspend", "Suspend member"]);
    }
    o.push(["none", "No action needed, mark as resolved"]);
    return o;
  }

  function open(r) {
    setDlg(r);
    setChoice(options(r)[0][0]);
    setNote("");
  }

  function submit() {
    const r = dlg;
    if (choice === "remove") actions.removeListing(r.kind, r.targetId, `report: ${r.reason}`);
    if (choice === "warn") actions.setMemberMuted(r.targetId, true);
    if (choice === "suspend") actions.setMemberStatus(r.targetId, "suspended", `report: ${r.reason}`);
    actions.resolveReport(r.id, "resolved", note.trim() || options(r).find((o) => o[0] === choice)[1]);
    setDlg(null);
  }

  return (
    <div>
      <PageHead title="Reports" sub="Reports from members about listings and other members." />
      <div className="mb-5 flex gap-1.5">
        {[["open", `Open (${all.filter((r) => r.status === "open").length})`], ["closed", "Closed"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3.5 py-2 text-xs font-semibold ${tab === k ? "bg-green text-white" : "bg-white text-charcoal ring-1 ring-green-dark/[0.1] hover:bg-green-50"}`}>{l}</button>
        ))}
      </div>
      <div className="space-y-4">
        {list.length === 0 ? (
          <EmptyState title={tab === "open" ? "No open reports" : "No closed reports"} />
        ) : (
          list.map((r) => (
            <Card key={r.id} data-report={r.id}>
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="blue">{r.kind}</Tag>
                <Tag tone="gold">{r.reason}</Tag>
                {r.status !== "open" && <Tag tone={r.status === "resolved" ? "green" : "grey"}>{r.status}</Tag>}
              </div>
              <h3 className="mt-3 text-base">{describe(r)}</h3>
              {r.detail && <p className="mt-1 text-sm text-charcoal/80">{r.detail}</p>}
              <p className="mt-2 text-xs text-muted">Reported by {nameFor(r.byMemberId)} · {fmt(r.at)}</p>
              {r.resolution && <p className="mt-1 text-xs text-muted">Outcome: {r.resolution}</p>}
              {r.status === "open" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-green-dark/10 pt-4">
                  <button className={solidBtn} onClick={() => open(r)}>Review</button>
                  <button className={smallBtn} onClick={() => actions.resolveReport(r.id, "dismissed", "Dismissed")}>Dismiss</button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <Confirm open={!!dlg} onClose={() => setDlg(null)} title="Resolve report" confirmLabel="Resolve" onConfirm={submit}>
        {dlg && (
          <div className="space-y-4">
            <p className="text-sm text-charcoal">{describe(dlg)} · {dlg.reason}</p>
            <Field label="Action">
              <Select value={choice} onChange={(e) => setChoice(e.target.value)}>
                {options(dlg).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </Select>
            </Field>
            <Field label="Note (optional)"><Input value={note} onChange={(e) => setNote(e.target.value)} /></Field>
          </div>
        )}
      </Confirm>
    </div>
  );
}
