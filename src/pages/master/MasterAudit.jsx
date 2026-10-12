import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { Input, Select } from "../../components/FormField";
import { PageHead, Tag, smallBtn, fmt } from "./ui";

export default function MasterAudit() {
  const { state } = useApp();
  const [q, setQ] = useState("");
  const [actor, setActor] = useState("all");
  const log = state.auditLog || [];
  const actors = [...new Set(log.map((a) => a.actor))];
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return log.filter((a) => (actor === "all" || a.actor === actor) && (!t || a.action.toLowerCase().includes(t)));
  }, [log, q, actor]);

  function exportCsv() {
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = ["When,Who,Role,Action", ...rows.map((a) => [a.at, a.actor, a.role, a.action].map(esc).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-log.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHead title="Audit log" sub="A record of every admin action: who did what, and when.">
        <button className={smallBtn} onClick={exportCsv} disabled={rows.length === 0}>Export CSV</button>
      </PageHead>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actions" aria-label="Search actions" />
        <Select value={actor} onChange={(e) => setActor(e.target.value)} aria-label="Filter by person" className="sm:!w-56">
          <option value="all">Everyone</option>
          {actors.map((a) => <option key={a}>{a}</option>)}
        </Select>
      </div>
      <Card className="mt-5 !p-0">
        {rows.length === 0 ? (
          <div className="p-5"><EmptyState title="No entries" body="Admin actions will be recorded here." /></div>
        ) : (
          <ul className="divide-y divide-green-dark/10">
            {rows.map((a) => (
              <li key={a.id} className="flex flex-col gap-1 px-5 py-3 text-sm sm:flex-row sm:items-baseline sm:gap-4">
                <span className="w-44 flex-shrink-0 text-xs text-muted">{fmt(a.at)}</span>
                <span className="min-w-0 flex-1"><span className="font-semibold text-charcoal">{a.actor}</span> <span className="text-charcoal/85">{a.action}</span></span>
                <Tag tone="grey">{a.role}</Tag>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
