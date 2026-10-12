import { useState } from "react";
import { useApp } from "../context/AppContext";
import Modal from "./Modal";
import { Field, Select, Textarea } from "./FormField";
import { REPORT_REASONS } from "../data/master";

export default function ReportButton({ kind, targetId, label = "Report" }) {
  const { actions, currentMember } = useApp();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [detail, setDetail] = useState("");

  function submit(e) {
    e.preventDefault();
    actions.submitReport(currentMember.id, { kind, targetId, reason, detail: detail.trim() });
    setDone(true);
  }
  function close() {
    setOpen(false);
    setDone(false);
    setDetail("");
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-xs font-medium text-muted underline-offset-2 hover:text-red-600 hover:underline">
        {label}
      </button>
      <Modal open={open} onClose={close} title={done ? "Report sent" : `Report this ${kind}`}>
        {done ? (
          <div>
            <p className="text-sm text-charcoal">Thank you. A moderator will review it and take action if it breaks the community rules.</p>
            <button onClick={close} className="btn-primary mt-5 w-full">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Field label="What is wrong?">
              <Select value={reason} onChange={(e) => setReason(e.target.value)}>
                {REPORT_REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
            </Field>
            <Field label="Details (optional)">
              <Textarea rows={3} value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Tell us what you saw." />
            </Field>
            <button type="submit" className="btn-primary w-full">Send report</button>
          </form>
        )}
      </Modal>
    </>
  );
}
