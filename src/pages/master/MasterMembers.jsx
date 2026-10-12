import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";
import { Field, Input, Select } from "../../components/FormField";
import { UK_CITIES } from "../../data/seed";
import { PageHead, Tag, Confirm, smallBtn, dangerBtn, solidBtn, fmt, fmtDate } from "./ui";

function statusTag(m) {
  if (m.status === "removed") return <Tag tone="grey">Removed</Tag>;
  if (m.status === "suspended") return <Tag tone="red">Suspended</Tag>;
  return <Tag tone="green">Active</Tag>;
}
function idTag(v) {
  return <Tag tone={v === "verified" ? "green" : v === "rejected" ? "red" : "gold"}>{v === "verified" ? "ID verified" : v === "rejected" ? "ID rejected" : "ID pending"}</Tag>;
}

export default function MasterMembers() {
  const { state, actions } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sel, setSel] = useState(null); // member id for detail modal
  const [edit, setEdit] = useState(null);
  const [confirm, setConfirm] = useState(null); // {id, status}
  const [note, setNote] = useState("");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return state.members
      .filter((m) => {
        if (filter === "removed") return m.status === "removed";
        if (m.status === "removed") return false;
        if (filter === "suspended") return m.status === "suspended";
        if (filter === "pending") return m.verificationStatus === "pending";
        if (filter === "verified") return m.verificationStatus === "verified";
        if (filter === "muted") return !!m.chatMuted;
        return true;
      })
      .filter((m) => !t || [m.fullName, m.email, m.city, m.idRef].some((v) => (v || "").toLowerCase().includes(t)));
  }, [state.members, q, filter]);

  const member = state.members.find((m) => m.id === sel);
  const msgs = member ? (state.chatMessages || []).filter((c) => c.memberId === member.id) : [];
  const cases = member ? state.consularCases.filter((c) => c.memberId === member.id) : [];
  const reportsAbout = member ? (state.reports || []).filter((r) => r.kind === "member" && r.targetId === member.id) : [];
  const trail = member ? (state.auditLog || []).filter((a) => a.action.includes(member.fullName)).slice(0, 6) : [];

  const target = confirm && state.members.find((m) => m.id === confirm.id);
  const verbs = { suspended: ["Suspend account", "Suspend"], removed: ["Remove account", "Remove"], active: ["Reinstate account", "Reinstate"] };

  function doConfirm() {
    actions.setMemberStatus(confirm.id, confirm.status, note.trim());
    setConfirm(null);
    setNote("");
  }

  function saveEdit(e) {
    e.preventDefault();
    actions.editMember(edit.id, { fullName: edit.fullName.trim(), email: edit.email.trim(), phone: edit.phone.trim(), city: edit.city });
    setEdit(null);
  }

  const filters = [
    ["all", "All"],
    ["pending", "ID pending"],
    ["verified", "Verified"],
    ["suspended", "Suspended"],
    ["muted", "Muted"],
    ["removed", "Removed"],
  ];

  return (
    <div>
      <PageHead title="Members" sub={`${state.members.filter((m) => m.status !== "removed").length} accounts. Search, edit, suspend or remove.`} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, city or ID" aria-label="Search members" />
        <div className="flex flex-wrap gap-1.5">
          {filters.map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold ${filter === k ? "bg-green text-white" : "bg-white text-charcoal ring-1 ring-green-dark/[0.1] hover:bg-green-50"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 ? (
          <EmptyState title="No members match" body="Try a different search or filter." />
        ) : (
          list.map((m) => (
            <Card key={m.id} data-member={m.id} className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-charcoal">{m.fullName}</div>
                <div className="break-all text-xs text-muted">{m.email} · {m.city} · {m.idRef}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {statusTag(m)}
                  {idTag(m.verificationStatus)}
                  {m.chatMuted && <Tag tone="gold">Muted</Tag>}
                  {m.warnings > 0 && <Tag tone="grey">{m.warnings} warning{m.warnings > 1 ? "s" : ""}</Tag>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className={smallBtn} onClick={() => setSel(m.id)}>View</button>
                <button className={smallBtn} onClick={() => setEdit({ ...m })}>Edit</button>
                {m.status === "removed" || m.status === "suspended" ? (
                  <button className={solidBtn} onClick={() => setConfirm({ id: m.id, status: "active" })}>Reinstate</button>
                ) : (
                  <>
                    <button className={smallBtn} onClick={() => setConfirm({ id: m.id, status: "suspended" })}>Suspend</button>
                    <button className={dangerBtn} onClick={() => setConfirm({ id: m.id, status: "removed" })}>Remove</button>
                  </>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail */}
      <Modal open={!!member} onClose={() => setSel(null)} title={member?.fullName || ""} wide>
        {member && (
          <div className="space-y-5 text-sm">
            <div className="flex flex-wrap gap-1.5">{statusTag(member)}{idTag(member.verificationStatus)}{member.chatMuted && <Tag tone="gold">Muted</Tag>}</div>
            <dl className="grid grid-cols-2 gap-3">
              {[["Email", member.email], ["Phone", member.phone], ["City", member.city], ["ID reference", member.idRef], ["Joined", fmtDate(member.joinedAt)], ["Youth member", member.isYouth ? "Yes" : "No"]].map(([k, v]) => (
                <div key={k}><dt className="text-xs text-muted">{k}</dt><dd className="break-all font-medium text-charcoal">{v}</dd></div>
              ))}
            </dl>
            {member.statusNote && <p className="rounded-xl bg-cream p-3">Last action note: {member.statusNote}</p>}
            <div>
              <h4 className="font-semibold text-charcoal">Activity</h4>
              <ul className="mt-1 list-disc pl-5 text-charcoal/80">
                <li>{cases.length} consular case{cases.length === 1 ? "" : "s"}</li>
                <li>{msgs.length} chat message{msgs.length === 1 ? "" : "s"} ({msgs.filter((x) => x.flagged).length} flagged)</li>
                <li>{reportsAbout.length} report{reportsAbout.length === 1 ? "" : "s"} against this member</li>
              </ul>
            </div>
            {trail.length > 0 && (
              <div>
                <h4 className="font-semibold text-charcoal">Admin history</h4>
                <ul className="mt-1 space-y-1 text-xs text-charcoal/80">
                  {trail.map((a) => <li key={a.id}>{fmt(a.at)}: {a.action}</li>)}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap gap-2 border-t border-green-dark/10 pt-4">
              <button className={smallBtn} onClick={() => actions.setMemberMuted(member.id, !member.chatMuted)}>
                {member.chatMuted ? "Unmute in chat" : "Mute in chat"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit */}
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit member">
        {edit && (
          <form onSubmit={saveEdit} className="space-y-4">
            <Field label="Full name"><Input value={edit.fullName} onChange={(e) => setEdit({ ...edit, fullName: e.target.value })} required /></Field>
            <Field label="Email"><Input type="email" value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} required /></Field>
            <Field label="Phone"><Input value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} /></Field>
            <Field label="City">
              <Select value={edit.city} onChange={(e) => setEdit({ ...edit, city: e.target.value })}>
                {[...new Set([edit.city, ...UK_CITIES])].map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <button type="submit" className="btn-primary w-full">Save changes</button>
          </form>
        )}
      </Modal>

      <Confirm
        open={!!confirm}
        onClose={() => { setConfirm(null); setNote(""); }}
        title={confirm ? verbs[confirm.status][0] : ""}
        body={target ? `${verbs[confirm.status][1]} ${target.fullName}? ${confirm.status === "active" ? "They will be able to log in again." : confirm.status === "removed" ? "They can no longer log in. You can reinstate them later." : "They cannot log in until reinstated."}` : ""}
        confirmLabel={confirm ? verbs[confirm.status][1] : ""}
        danger={confirm?.status === "removed"}
        onConfirm={doConfirm}
      >
        {confirm?.status !== "active" && (
          <div className="mt-4">
            <Field label="Reason (recorded in the audit log)"><Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Repeated spam" /></Field>
          </div>
        )}
      </Confirm>
    </div>
  );
}
