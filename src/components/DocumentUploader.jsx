import { useRef, useState } from "react";
import { ACCEPT, MAX_FILES, prepareFile, formatSize, openDocument, downloadDocument } from "../lib/files";

function Row({ label, hint, required, doc, onPick, onRemove, busy }) {
  const ref = useRef(null);
  return (
    <div className="rounded-2xl border-[1.5px] border-green-dark/10 bg-white p-3.5" data-doc-row={label}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-charcoal">
            {label}{" "}
            <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${required ? "bg-gold/20 text-gold-dark" : "bg-slate-100 text-slate-500"}`}>
              {required ? "Required" : "Optional"}
            </span>
          </p>
          {hint && <p className="text-xs text-muted">{hint}</p>}
        </div>
        {doc ? (
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-green">
              <span aria-hidden>✓</span>
              <span className="max-w-[10rem] truncate text-charcoal">{doc.name}</span>
              <span className="text-muted">{formatSize(doc.size)}</span>
            </span>
            <button type="button" onClick={() => openDocument(doc)} className="font-semibold text-blue hover:underline">View</button>
            <button type="button" onClick={onRemove} className="font-semibold text-red-600 hover:underline">Remove</button>
          </div>
        ) : (
          <>
            <input
              ref={ref}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              aria-label={`Upload ${label}`}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) onPick(f);
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => ref.current?.click()}
              className="rounded-full border-[1.5px] border-green/40 px-4 py-1.5 text-xs font-semibold text-green transition hover:bg-green-50 disabled:opacity-50"
            >
              Upload file
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// docs: { [key]: {name,size,type,dataUrl} }, extras: [{id,name,size,type,dataUrl}]
export default function DocumentUploader({ required, docs, setDocs, extras, setExtras }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const extraRef = useRef(null);
  const total = Object.keys(docs).length + extras.length;

  async function pick(key, file) {
    setError("");
    setBusy(true);
    try {
      const d = await prepareFile(file);
      setDocs((x) => ({ ...x, [key]: d }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function addExtra(file) {
    setError("");
    if (total >= MAX_FILES) {
      setError(`You can attach up to ${MAX_FILES} files.`);
      return;
    }
    setBusy(true);
    try {
      const d = await prepareFile(file);
      setExtras((x) => [...x, { ...d, id: `x_${Date.now()}_${x.length}` }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-charcoal">Supporting documents</legend>
      <p className="-mt-1 text-xs text-muted">PDF, JPG or PNG, up to 1.5 MB each. Photos are resized automatically.</p>
      {required.map((r) => (
        <Row
          key={r.key}
          label={r.label}
          hint={r.hint}
          required={r.required}
          doc={docs[r.key]}
          busy={busy}
          onPick={(f) => pick(r.key, f)}
          onRemove={() => setDocs((x) => { const n = { ...x }; delete n[r.key]; return n; })}
        />
      ))}

      {extras.map((d) => (
        <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-[1.5px] border-green-dark/10 bg-white p-3.5 text-xs">
          <span className="min-w-0 font-medium text-charcoal">
            <span className="mr-1.5 text-green" aria-hidden>✓</span>
            Additional: <span className="truncate">{d.name}</span> <span className="text-muted">{formatSize(d.size)}</span>
          </span>
          <span className="flex gap-3">
            <button type="button" onClick={() => openDocument(d)} className="font-semibold text-blue hover:underline">View</button>
            <button type="button" onClick={() => setExtras((x) => x.filter((e) => e.id !== d.id))} className="font-semibold text-red-600 hover:underline">Remove</button>
          </span>
        </div>
      ))}

      <div>
        <input
          ref={extraRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          aria-label="Upload another relevant document"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) addExtra(f);
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => extraRef.current?.click()}
          className="rounded-full border-[1.5px] border-dashed border-green/50 px-4 py-2 text-sm font-semibold text-green transition hover:bg-green-50 disabled:opacity-50"
        >
          + Upload another relevant document
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}

export function DocumentList({ documents, onAdd, canAdd }) {
  const ref = useRef(null);
  const [error, setError] = useState("");
  const list = documents || [];
  return (
    <div className="mt-3 rounded-lg bg-sand/60 p-3 text-xs" data-docs-list>
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-charcoal">Documents ({list.length})</span>
        {canAdd && (
          <>
            <input
              ref={ref}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              aria-label="Add a document to this application"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                try {
                  setError("");
                  await onAdd(await prepareFile(f));
                } catch (err) {
                  setError(err.message);
                }
              }}
            />
            <button type="button" onClick={() => ref.current?.click()} className="font-semibold text-green hover:underline">+ Add document</button>
          </>
        )}
      </div>
      {list.length === 0 ? (
        <p className="mt-1 text-muted">No documents attached.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {list.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0 text-charcoal">
                <span className="font-medium">{d.label}</span>
                <span className="text-muted"> · {d.name} · {formatSize(d.size)}</span>
              </span>
              <span className="flex gap-3">
                <button type="button" onClick={() => openDocument(d)} className="font-semibold text-blue hover:underline">View</button>
                <button type="button" onClick={() => downloadDocument(d)} className="font-semibold text-blue hover:underline">Download</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
