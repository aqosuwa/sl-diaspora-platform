import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { Field, Textarea } from "../../components/FormField";
import { idChecks, defaultIdDoc } from "../../data/master";
import { PageHead, Tag, Confirm, solidBtn, dangerBtn, smallBtn, fmtDate } from "./ui";

function IdPreview({ doc, name }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-dark to-green p-4 text-white shadow-card" aria-label="Uploaded ID document">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-white/70">
        <span>Republic of Sierra Leone</span>
        <span>{doc.type}</span>
      </div>
      <div className="mt-3 flex gap-3">
        <div className={`flex h-20 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-white/15 text-2xl ${doc.photoClear === false ? "blur-[3px]" : ""}`}>
          {(doc.nameOnId || name || "?")[0]}
        </div>
        <div className="min-w-0 text-sm">
          <div className="text-[11px] text-white/60">Name</div>
          <div className="truncate font-semibold">{doc.nameOnId}</div>
          <div className="mt-1 text-[11px] text-white/60">Document no.</div>
          <div className="font-mono text-xs">{doc.number}</div>
          <div className="mt-1 text-[11px] text-white/60">Expires</div>
          <div className="text-xs">{doc.expiry ? fmtDate(doc.expiry) : "Not provided"}</div>
        </div>
      </div>
    </div>
  );
}

export default function MasterIds() {
  const { state, actions } = useApp();
  const [tab, setTab] = useState("pending");
  const [dlg, setDlg] = useState(null); // {id, kind: 'rejected'|'more-info'}
  const [reason, setReason] = useState("");

  const all = state.members.filter((m) => m.status !== "removed");
  const list = all.filter((m) => (tab === "all" ? true : m.verificationStatus === tab));
  const counts = {
    pending: all.filter((m) => m.verificationStatus === "pending").length,
    verified: all.filter((m) => m.verificationStatus === "verified").length,
    rejected: all.filter((m) => m.verificationStatus === "rejected").length,
  };
  const target = dlg && state.members.find((m) => m.id === dlg.id);

  function submitDlg() {
    actions.reviewId(dlg.id, dlg.kind, { reason: reason.trim() || undefined });
    setDlg(null);
    setReason("");
  }

  return (
    <div>
      <PageHead title="ID verification" sub="Check each document against the member's profile before approving." />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {[["pending", `Pending (${counts.pending})`], ["verified", `Verified (${counts.verified})`], ["rejected", `Rejected (${counts.rejected})`], ["all", "All"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3.5 py-2 text-xs font-semibold ${tab === k ? "bg-green text-white" : "bg-white text-charcoal ring-1 ring-green-dark/[0.1] hover:bg-green-50"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <EmptyState title="Nothing in this list" body="New ID submissions will appear here." />
        ) : (
          list.map((m) => {
            const doc = m.idDoc || defaultIdDoc(m);
            const checks = idChecks({ ...m, idDoc: doc }, state.members);
            const failed = checks.filter((c) => !c.ok).length;
            return (
              <Card key={m.id} data-idcard={m.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg">{m.fullName}</h3>
                    <p className="text-xs text-muted">{m.email} · {m.city} · joined {fmtDate(m.joinedAt)}</p>
                  </div>
                  <Tag tone={m.verificationStatus === "verified" ? "green" : m.verificationStatus === "rejected" ? "red" : "gold"}>
                    {m.verificationStatus}
                  </Tag>
                </div>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <IdPreview doc={doc} name={m.fullName} />
                  <div>
                    <ul className="space-y-2">
                      {checks.map((c) => (
                        <li key={c.key} className="flex items-start gap-2 text-sm">
                          <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${c.ok ? "bg-green-50 text-green" : "bg-red-50 text-red-600"}`}>
                            {c.ok ? "✓" : "!"}
                          </span>
                          <span>
                            <span className="font-medium text-charcoal">{c.label}</span>
                            <span className="block text-xs text-muted">{c.detail}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <label className="mt-3 flex items-center gap-2 text-xs text-charcoal">
                      <input type="checkbox" checked={doc.photoClear !== false} onChange={(e) => actions.setIdPhotoClear(m.id, e.target.checked)} />
                      Photo and text are legible
                    </label>
                    {failed > 0 && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{failed} check{failed > 1 ? "s" : ""} failed. Review before approving.</p>}
                    {m.idDoc?.adminNote && <p className="mt-3 rounded-xl bg-cream px-3 py-2 text-xs text-charcoal">Note sent to member: {m.idDoc.adminNote}</p>}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-green-dark/10 pt-4">
                  {m.verificationStatus !== "verified" && (
                    <button className={solidBtn} onClick={() => actions.reviewId(m.id, "verified")}>Approve ID</button>
                  )}
                  {m.verificationStatus === "pending" && (
                    <button className={smallBtn} onClick={() => { setDlg({ id: m.id, kind: "more-info" }); setReason("Please upload a clearer photo of your ID."); }}>Request better photo</button>
                  )}
                  {m.verificationStatus !== "rejected" && (
                    <button className={dangerBtn} onClick={() => { setDlg({ id: m.id, kind: "rejected" }); setReason(""); }}>
                      {m.verificationStatus === "verified" ? "Revoke" : "Reject"}
                    </button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Confirm
        open={!!dlg}
        onClose={() => setDlg(null)}
        title={dlg?.kind === "rejected" ? "Reject ID" : "Request a better photo"}
        body={target ? `This message is shown to ${target.fullName} on their dashboard.` : ""}
        confirmLabel={dlg?.kind === "rejected" ? "Reject ID" : "Send request"}
        danger={dlg?.kind === "rejected"}
        onConfirm={submitDlg}
      >
        <div className="mt-4">
          <Field label="Message to member"><Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
        </div>
      </Confirm>
    </div>
  );
}
