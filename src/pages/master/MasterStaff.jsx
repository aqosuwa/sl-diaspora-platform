import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import Modal from "../../components/Modal";
import { Field, Input, Select } from "../../components/FormField";
import { ROLES, ROLE_NAMES, COMMISSION_ROLES, areaOfRole, SECTIONS } from "../../data/master";
import { PageHead, Tag, Confirm, smallBtn, dangerBtn, solidBtn } from "./ui";

export default function MasterStaff() {
  const { state, actions, currentStaff } = useApp();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Moderator" });
  const [error, setError] = useState("");
  const [del, setDel] = useState(null);

  const masters = state.staff.filter((s) => s.role === "Master admin" && s.active).length;

  function add(e) {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter a name and a valid email.");
      return;
    }
    if (state.staff.some((s) => s.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setError("A staff account already uses that email.");
      return;
    }
    actions.addStaff({ name: form.name.trim(), email: form.email.trim(), role: form.role });
    setForm({ name: "", email: "", role: "Moderator" });
    setError("");
    setAdding(false);
  }

  const lastMaster = (s) => s.role === "Master admin" && s.active && masters <= 1;
  const delTarget = del && state.staff.find((s) => s.id === del);

  return (
    <div>
      <PageHead title="Staff and roles" sub="Master console and Commission desk accounts are kept separate.">
        <button className="btn-primary !w-auto" onClick={() => setAdding(true)}>Add staff</button>
      </PageHead>
      {[["master", "Master console team", "Run the platform: members, moderation, content."], ["commission", "Commission staff", "Handle consular cases and referrals at the Commission desk (/admin). They never see the master console."]].map(([area, heading, blurb]) => (
        <div key={area} className="mb-8">
          <h2 className="text-lg">{heading}</h2>
          <p className="mb-3 text-sm text-muted">{blurb}</p>
          <div className="space-y-3">
            {state.staff.filter((s) => (s.area || areaOfRole(s.role)) === area).map((s) => (
              <Card key={s.id} data-staff={s.id} className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-charcoal">{s.name} {s.id === currentStaff.id && <span className="text-xs font-normal text-muted">(you)</span>}</div>
                  <div className="break-all text-xs text-muted">{s.email}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Tag tone={s.active ? "green" : "grey"}>{s.active ? "Active" : "Disabled"}</Tag>
                    <Tag tone="blue">{s.role}</Tag>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`role-${s.id}`}>Role for {s.name}</label>
                  <Select id={`role-${s.id}`} value={s.role} disabled={lastMaster(s)} onChange={(e) => actions.updateStaff(s.id, { role: e.target.value })} className="!w-auto !py-1.5 !text-xs">
                    {(area === "master" ? ROLE_NAMES : COMMISSION_ROLES).map((r) => <option key={r}>{r}</option>)}
                  </Select>
                  {s.id !== currentStaff.id && !lastMaster(s) && (
                    <>
                      <button className={s.active ? smallBtn : solidBtn} onClick={() => actions.updateStaff(s.id, { active: !s.active })}>
                        {s.active ? "Disable" : "Enable"}
                      </button>
                      <button className={dangerBtn} onClick={() => setDel(s.id)}>Delete</button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Card className="mt-8">
        <h2 className="text-lg">What each master console role can open</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="text-xs text-muted">
                <th className="py-2 pr-3 font-semibold">Role</th>
                {SECTIONS.filter((s) => s.key !== "overview").map((s) => <th key={s.key} className="px-2 py-2 text-center font-semibold">{s.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROLE_NAMES.map((r) => (
                <tr key={r} className="border-t border-green-dark/10">
                  <td className="py-2 pr-3 font-medium text-charcoal">{r}</td>
                  {SECTIONS.filter((s) => s.key !== "overview").map((s) => (
                    <td key={s.key} className="px-2 py-2 text-center">{ROLES[r].includes(s.key) ? <span className="text-green">✓</span> : <span className="text-slate-300">–</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add staff account">
        <form onSubmit={add} className="space-y-4">
          <Field label="Full name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@slhc-diaspora.org" /></Field>
          <Field label="Role">
            <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <optgroup label="Master console">{ROLE_NAMES.map((r) => <option key={r}>{r}</option>)}</optgroup>
              <optgroup label="Commission desk">{COMMISSION_ROLES.map((r) => <option key={r}>{r}</option>)}</optgroup>
            </Select>
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">Create account</button>
        </form>
      </Modal>
      <Confirm
        open={!!del}
        onClose={() => setDel(null)}
        title="Delete staff account"
        body={delTarget ? `Delete ${delTarget.name}? They will no longer be able to sign in.` : ""}
        confirmLabel="Delete"
        danger
        onConfirm={() => { actions.removeStaff(del); setDel(null); }}
      />
    </div>
  );
}
