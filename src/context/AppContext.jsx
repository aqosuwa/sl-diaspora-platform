import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  seedMembers,
  seedProfessionals,
  seedJobs,
  seedBusinesses,
  seedConsularCases,
  seedReferrals,
  seedEvents,
  seedNews,
  seedYouthPosts,
} from "../data/seed";
import { makeId, makeCaseRef } from "../lib/id";
import {
  seedStaff,
  seedSiteSettings,
  seedChatMessages,
  seedReports,
  extraMembers,
  ROLES,
  areaOfRole,
  matchBanned,
} from "../data/master";

const STORAGE_KEY = "sl-diaspora-platform-state-v1";

const CASE_PREFIX = {
  "New Passport Application": "NPP",
  "Passport Renewal": "PSP",
  "National ID Renewal": "NID",
  "Visa Application": "VSA",
  "Emergency Travel Certificate": "ETC",
};

// Older saved states predate the master admin; fill in whatever is missing.
function withMasterDefaults(st) {
  const out = { ...st };
  if (out.staff && !out.staff.some((s) => s.area === "commission")) {
    out.staff = [
      ...out.staff.map((s) => ({ ...s, area: s.area || areaOfRole(s.role) })),
      ...seedStaff.filter((s) => s.area === "commission"),
    ];
  }
  if (!out.staff) {
    out.staff = seedStaff;
    const have = new Set(out.members.map((m) => m.id));
    out.members = [...out.members, ...extraMembers.filter((m) => !have.has(m.id))];
  }
  if (!out.siteSettings) out.siteSettings = seedSiteSettings;
  if (!out.chatMessages) out.chatMessages = seedChatMessages;
  if (!out.reports) out.reports = seedReports;
  if (!out.auditLog) out.auditLog = [];
  if (!out.broadcasts) out.broadcasts = [];
  if (!out.youthPosts) out.youthPosts = seedYouthPosts;
  out.session = { staffId: null, ...out.session };
  return out;
}

function loadInitialState() {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return withMasterDefaults(JSON.parse(raw));
    } catch {
      // fall through to seed
    }
  }
  return withMasterDefaults({
    members: seedMembers,
    professionals: seedProfessionals,
    jobs: seedJobs.map((j) => ({ ...j, applicants: [] })),
    businesses: seedBusinesses,
    consularCases: seedConsularCases,
    referrals: seedReferrals,
    events: seedEvents,
    news: seedNews,
    youthPosts: seedYouthPosts,
    session: { memberId: null, isAdmin: false, staffId: null },
  });
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full / unavailable — prototype continues in-memory
    }
  }, [state]);

  const actions = useMemo(() => {
    const update = (key, updater) =>
      setState((prev) => ({ ...prev, [key]: updater(prev[key]) }));

    // State change + an optional audit entry (string, or fn(prevState) -> string).
    const mutate = (fn, audit) =>
      setState((prev) => {
        const next = fn(prev);
        if (!audit) return next;
        const staff = (prev.staff || []).find((s) => s.id === prev.session.staffId);
        const text = typeof audit === "function" ? audit(prev) : audit;
        return {
          ...next,
          auditLog: [
            {
              id: makeId("au"),
              at: new Date().toISOString(),
              actor: staff?.name || "Commission admin",
              role: staff?.role || "Admin",
              action: text,
            },
            ...(next.auditLog || []),
          ].slice(0, 500),
        };
      });

    return {
      // ---------- auth ----------
      registerMember(data) {
        const id = makeId("mem");
        const member = {
          id,
          fullName: data.fullName,
          email: data.email,
          city: data.city,
          phone: data.phone,
          isYouth: !!data.isYouth,
          isProfessional: false,
          verificationStatus: "pending",
          joinedAt: new Date().toISOString(),
          idRef: data.idRef,
          idDoc: {
            type: (data.idRef || "").toUpperCase().includes("NID") ? "National ID" : "Passport",
            number: data.idRef,
            nameOnId: data.fullName,
            expiry: "",
            photoClear: true,
          },
        };
        update("members", (list) => [...list, member]);
        setState((prev) => ({ ...prev, session: { memberId: id, isAdmin: false, staffId: null } }));
        return id;
      },
      login(email) {
        let found = null;
        setState((prev) => {
          found = prev.members.find(
            (m) => m.email.toLowerCase() === email.toLowerCase()
          );
          if (!found) return prev;
          if (found.status === "suspended" || found.status === "removed") return prev;
          return { ...prev, session: { memberId: found.id, isAdmin: false, staffId: null } };
        });
        return found;
      },
      logout() {
        setState((prev) => ({ ...prev, session: { memberId: null, isAdmin: false, staffId: null } }));
      },
      loginAdmin() {
        setState((prev) => ({ ...prev, session: { memberId: null, isAdmin: true, staffId: null } }));
      },
      logoutAdmin() {
        setState((prev) => ({ ...prev, session: { memberId: null, isAdmin: false, staffId: null } }));
      },
      loginStaff(email) {
        let found = null;
        setState((prev) => {
          found = prev.staff.find(
            (s) => s.area !== "commission" && s.email.toLowerCase() === email.trim().toLowerCase() && s.active
          );
          if (!found) return prev;
          return {
            ...prev,
            session: { memberId: null, isAdmin: found.role === "Master admin", staffId: found.id },
            auditLog: [
              { id: makeId("au"), at: new Date().toISOString(), actor: found.name, role: found.role, action: "Signed in to the master area" },
              ...(prev.auditLog || []),
            ].slice(0, 500),
          };
        });
        return found;
      },
      loginCommission(email) {
        let found = null;
        setState((prev) => {
          found = prev.staff.find(
            (s) => s.area === "commission" && s.email.toLowerCase() === email.trim().toLowerCase() && s.active
          );
          if (!found) return prev;
          return { ...prev, session: { memberId: null, isAdmin: true, staffId: null, commissionId: found.id } };
        });
        return found;
      },
      logoutStaff() {
        setState((prev) => ({ ...prev, session: { memberId: null, isAdmin: false, staffId: null } }));
      },

      // ---------- consular ----------
      submitConsularCase(memberId, { type, notes, details, payment, documents }) {
        const prefix = CASE_PREFIX[type] || "CASE";
        const newCase = {
          id: makeId("case"),
          memberId,
          type,
          caseRef: makeCaseRef(prefix),
          status: "Submitted",
          submittedAt: new Date().toISOString(),
          notes: notes || "",
          details: details || {},
          payment: payment || null,
          documents: (documents || []).map((d, i) => ({ ...d, id: makeId("doc") })),
          timeline: [
            {
              status: "Submitted",
              at: new Date().toISOString(),
              note:
                payment && payment.status === "Paid"
                  ? `Application received. Payment of £${payment.amount.toFixed(2)} confirmed (${payment.receiptNo}).`
                  : payment
                  ? "Application received. Awaiting confirmation of your bank transfer."
                  : "Application received and queued for review.",
            },
          ],
        };
        update("consularCases", (list) => [newCase, ...list]);
        return newCase;
      },
      addCaseDocument(caseId, doc) {
        update("consularCases", (list) =>
          list.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  documents: [...(c.documents || []), { ...doc, id: makeId("doc"), label: doc.label || "Additional document" }],
                  timeline: [
                    ...c.timeline,
                    { status: c.status, at: new Date().toISOString(), note: `Document added: ${doc.name}.` },
                  ],
                }
              : c
          )
        );
      },
      withdrawConsularCase(caseId) {
        update("consularCases", (list) =>
          list.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  status: "Withdrawn",
                  timeline: [
                    ...c.timeline,
                    {
                      status: "Withdrawn",
                      at: new Date().toISOString(),
                      note:
                        c.payment && c.payment.status === "Paid"
                          ? "Withdrawn by member. Refund will be returned to the original payment method within 5–10 working days."
                          : "Withdrawn by member.",
                    },
                  ],
                  payment:
                    c.payment && c.payment.status === "Paid" ? { ...c.payment, status: "Refund pending" } : c.payment,
                }
              : c
          )
        );
      },
      confirmPayment(caseId) {
        update("consularCases", (list) =>
          list.map((c) =>
            c.id === caseId && c.payment
              ? {
                  ...c,
                  payment: { ...c.payment, status: "Paid", confirmedAt: new Date().toISOString() },
                  timeline: [
                    ...c.timeline,
                    {
                      status: c.status,
                      at: new Date().toISOString(),
                      note: `Bank transfer received and confirmed (${c.payment.receiptNo}).`,
                    },
                  ],
                }
              : c
          )
        );
      },

      // ---------- referrals ----------
      submitReferral(memberId, { category, country, description }) {
        const referral = {
          id: makeId("ref"),
          memberId,
          category,
          country,
          description,
          status: "Submitted",
          submittedAt: new Date().toISOString(),
          matchedProfessionalId: null,
          timeline: [
            { status: "Submitted", at: new Date().toISOString(), note: "Request received — visible only to caseworkers." },
          ],
        };
        update("referrals", (list) => [referral, ...list]);
        return referral;
      },
      withdrawReferral(id) {
        update("referrals", (list) =>
          list.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: "Withdrawn",
                  timeline: [...r.timeline, { status: "Withdrawn", at: new Date().toISOString(), note: "Withdrawn by member." }],
                }
              : r
          )
        );
      },

      // ---------- jobs & businesses (member-facing submit) ----------
      applyToJob(jobId, memberId) {
        update("jobs", (list) =>
          list.map((j) =>
            j.id === jobId && !j.applicants?.includes(memberId)
              ? { ...j, applicants: [...(j.applicants || []), memberId] }
              : j
          )
        );
      },
      postJob(data) {
        const job = {
          id: makeId("job"),
          ...data,
          status: "pending",
          postedAt: new Date().toISOString(),
          applicants: [],
        };
        update("jobs", (list) => [job, ...list]);
        return job;
      },
      postBusiness(data) {
        const biz = {
          id: makeId("biz"),
          ...data,
          status: "pending",
        };
        update("businesses", (list) => [biz, ...list]);
        return biz;
      },

      // ---------- member: profile ----------
      updateMemberProfile(memberId, patch) {
        update("members", (list) =>
          list.map((m) => (m.id === memberId ? { ...m, ...patch } : m))
        );
      },

      // ---------- admin: verification ----------
      setMemberVerification(memberId, status) {
        update("members", (list) =>
          list.map((m) => (m.id === memberId ? { ...m, verificationStatus: status } : m))
        );
      },
      setProfessionalVerification(proId, status) {
        update("professionals", (list) =>
          list.map((p) => (p.id === proId ? { ...p, verificationStatus: status } : p))
        );
      },

      // ---------- admin: consular ----------
      updateCaseStatus(caseId, status, note) {
        update("consularCases", (list) =>
          list.map((c) =>
            c.id === caseId
              ? {
                  ...c,
                  status,
                  timeline: [...c.timeline, { status, at: new Date().toISOString(), note: note || "" }],
                }
              : c
          )
        );
      },

      // ---------- admin: referrals ----------
      matchReferral(referralId, professionalId) {
        update("referrals", (list) =>
          list.map((r) =>
            r.id === referralId
              ? {
                  ...r,
                  status: "Matched",
                  matchedProfessionalId: professionalId,
                  timeline: [
                    ...r.timeline,
                    { status: "Matched", at: new Date().toISOString(), note: "Matched to a verified professional." },
                  ],
                }
              : r
          )
        );
      },
      closeReferral(referralId) {
        update("referrals", (list) =>
          list.map((r) =>
            r.id === referralId
              ? {
                  ...r,
                  status: "Closed",
                  timeline: [...r.timeline, { status: "Closed", at: new Date().toISOString(), note: "Case closed." }],
                }
              : r
          )
        );
      },

      // ---------- admin: moderation ----------
      setJobStatus(jobId, status) {
        update("jobs", (list) => list.map((j) => (j.id === jobId ? { ...j, status } : j)));
      },
      setBusinessStatus(bizId, status) {
        update("businesses", (list) => list.map((b) => (b.id === bizId ? { ...b, status } : b)));
      },

      // ---------- youth board ----------
      addYouthPost(memberId, { title, body }) {
        const post = { id: makeId("yp"), memberId, title, body, createdAt: new Date().toISOString() };
        update("youthPosts", (list) => [post, ...(list || [])]);
        return post;
      },
      deleteYouthPost(id) {
        update("youthPosts", (list) => (list || []).filter((p) => p.id !== id));
      },


      // ---------- community chat (members) ----------
      postChatMessage(memberId, room, text) {
        const clean = (text || "").trim();
        if (!clean) return null;
        const msg = { id: makeId("cm"), room, memberId, text: clean, at: new Date().toISOString() };
        setState((prev) => {
          const me = prev.members.find((m) => m.id === memberId);
          if (!me || me.chatMuted || me.status === "suspended" || me.status === "removed") return prev;
          const hits = matchBanned(clean, prev.siteSettings.bannedWords);
          const m2 = hits.length
            ? { ...msg, flagged: true, flagSource: "auto", flagReason: `Matched banned phrases: ${hits.join(", ")}`, modStatus: "open" }
            : msg;
          return { ...prev, chatMessages: [...(prev.chatMessages || []), m2] };
        });
        return msg;
      },
      reportChatMessage(messageId, byMemberId, reason) {
        update("chatMessages", (list) =>
          list.map((m) =>
            m.id === messageId && m.modStatus !== "removed"
              ? { ...m, flagged: true, flagSource: m.flagSource || "report", flagReason: m.flagReason || reason, reportedBy: m.reportedBy || byMemberId, modStatus: m.modStatus === "dismissed" ? "open" : m.modStatus || "open" }
              : m
          )
        );
      },
      submitReport(byMemberId, { kind, targetId, reason, detail }) {
        const r = { id: makeId("rp"), kind, targetId, reason, detail: detail || "", byMemberId, at: new Date().toISOString(), status: "open" };
        update("reports", (list) => [r, ...(list || [])]);
        return r;
      },

      // ---------- master admin ----------
      auditNote(action) {
        mutate((p) => p, action);
      },
      setMemberStatus(memberId, status, note) {
        // status: active | suspended | removed
        mutate(
          (p) => ({
            ...p,
            members: p.members.map((m) =>
              m.id === memberId
                ? { ...m, status, statusNote: note || "", chatMuted: status === "active" ? m.chatMuted : m.chatMuted }
                : m
            ),
          }),
          (p) => {
            const m = p.members.find((x) => x.id === memberId);
            const verb = { active: "Reinstated", suspended: "Suspended", removed: "Removed account of" }[status];
            return `${verb} ${m?.fullName || memberId}${note ? ` (${note})` : ""}`;
          }
        );
      },
      setMemberMuted(memberId, muted) {
        mutate(
          (p) => ({ ...p, members: p.members.map((m) => (m.id === memberId ? { ...m, chatMuted: muted } : m)) }),
          (p) => `${muted ? "Muted" : "Unmuted"} ${p.members.find((x) => x.id === memberId)?.fullName} in community chat`
        );
      },
      editMember(memberId, patch) {
        mutate(
          (p) => ({ ...p, members: p.members.map((m) => (m.id === memberId ? { ...m, ...patch } : m)) }),
          (p) => `Edited profile of ${p.members.find((x) => x.id === memberId)?.fullName}`
        );
      },
      reviewId(memberId, decision, { reason, photoClear } = {}) {
        // decision: verified | rejected | more-info
        mutate(
          (p) => ({
            ...p,
            members: p.members.map((m) => {
              if (m.id !== memberId) return m;
              const idDoc = { ...(m.idDoc || {}), ...(photoClear === undefined ? {} : { photoClear }) };
              if (decision === "verified") return { ...m, verificationStatus: "verified", idDoc: { ...idDoc, adminNote: "" } };
              if (decision === "rejected") return { ...m, verificationStatus: "rejected", idDoc: { ...idDoc, adminNote: reason || "ID could not be verified." } };
              return { ...m, verificationStatus: "pending", idDoc: { ...idDoc, adminNote: reason || "Please upload a clearer photo of your ID." } };
            }),
          }),
          (p) => {
            const m = p.members.find((x) => x.id === memberId);
            const verb = { verified: "Verified ID of", rejected: "Rejected ID of", "more-info": "Asked for a better ID photo from" }[decision];
            return `${verb} ${m?.fullName}${reason ? ` (${reason})` : ""}`;
          }
        );
      },
      setIdPhotoClear(memberId, clear) {
        mutate((p) => ({
          ...p,
          members: p.members.map((m) => (m.id === memberId ? { ...m, idDoc: { ...(m.idDoc || {}), photoClear: clear } } : m)),
        }));
      },
      resolveChatFlag(messageId, decision, { warn, mute, suspend } = {}) {
        // decision: dismissed | removed
        mutate(
          (p) => {
            const msg = (p.chatMessages || []).find((m) => m.id === messageId);
            return {
              ...p,
              chatMessages: p.chatMessages.map((m) =>
                m.id === messageId ? { ...m, modStatus: decision, handledAt: new Date().toISOString() } : m
              ),
              members: p.members.map((m) => {
                if (!msg || m.id !== msg.memberId) return m;
                return {
                  ...m,
                  chatMuted: mute ? true : m.chatMuted,
                  status: suspend ? "suspended" : m.status,
                  warnings: warn ? (m.warnings || 0) + 1 : m.warnings,
                };
              }),
            };
          },
          (p) => {
            const msg = (p.chatMessages || []).find((m) => m.id === messageId);
            const who = p.members.find((x) => x.id === msg?.memberId)?.fullName;
            const extras = [warn && "warned", mute && "muted", suspend && "suspended"].filter(Boolean).join(", ");
            return `${decision === "removed" ? "Removed" : "Cleared flag on"} a chat message by ${who}${extras ? ` and ${extras} the member` : ""}`;
          }
        );
      },
      resolveReport(reportId, status, resolution) {
        mutate(
          (p) => ({
            ...p,
            reports: p.reports.map((r) =>
              r.id === reportId ? { ...r, status, resolution: resolution || "", handledAt: new Date().toISOString() } : r
            ),
          }),
          `${status === "resolved" ? "Resolved" : "Dismissed"} report ${reportId.slice(-4)}${resolution ? ` (${resolution})` : ""}`
        );
      },
      removeListing(kind, id, reasonText) {
        // kind: job | business | event | news | youth
        const key = { job: "jobs", business: "businesses", event: "events", news: "news", youth: "youthPosts" }[kind];
        mutate(
          (p) => ({ ...p, [key]: (p[key] || []).filter((x) => x.id !== id) }),
          (p) => {
            const item = (p[key] || []).find((x) => x.id === id);
            return `Removed ${kind} "${item?.title || item?.name || id}"${reasonText ? ` (${reasonText})` : ""}`;
          }
        );
      },
      saveListing(kind, data) {
        const key = { job: "jobs", business: "businesses", event: "events", news: "news" }[kind];
        const isNew = !data.id;
        const item = isNew
          ? {
              ...data,
              id: makeId(kind),
              ...(kind === "job" ? { status: "published", postedAt: new Date().toISOString(), applicants: [] } : {}),
              ...(kind === "business" ? { status: "published" } : {}),
              ...(kind === "news" ? { date: new Date().toISOString().slice(0, 10) } : {}),
            }
          : data;
        mutate(
          (p) => ({
            ...p,
            [key]: isNew ? [item, ...p[key]] : p[key].map((x) => (x.id === item.id ? { ...x, ...item } : x)),
          }),
          `${isNew ? "Added" : "Edited"} ${kind} "${item.title || item.name}"`
        );
        return item;
      },
      saveSiteSettings(patch, label) {
        mutate((p) => ({ ...p, siteSettings: { ...p.siteSettings, ...patch } }), label || "Updated site settings");
      },
      sendBroadcast({ title, body, audience }) {
        const b = { id: makeId("bc"), title, body, audience, at: new Date().toISOString() };
        mutate(
          (p) => ({ ...p, broadcasts: [b, ...(p.broadcasts || [])] }),
          (p) => {
            const a = audience.type === "city" ? `members in ${audience.city}` : { all: "all members", youth: "youth members", verified: "verified members" }[audience.type];
            return `Sent broadcast "${title}" to ${a}`;
          }
        );
        return b;
      },
      deleteBroadcast(id) {
        mutate((p) => ({ ...p, broadcasts: p.broadcasts.filter((b) => b.id !== id) }), "Deleted a broadcast");
      },
      addStaff({ name, email, role }) {
        const s = { id: makeId("staff"), name, email, role, area: areaOfRole(role), active: true };
        mutate((p) => ({ ...p, staff: [...p.staff, s] }), `Added staff account for ${name} (${role})`);
        return s;
      },
      updateStaff(id, patch) {
        mutate(
          (p) => ({ ...p, staff: p.staff.map((s) => (s.id === id ? { ...s, ...patch } : s)) }),
          (p) => {
            const s = p.staff.find((x) => x.id === id);
            if (patch.role) return `Changed role of ${s?.name} to ${patch.role}`;
            if ("active" in patch) return `${patch.active ? "Re-enabled" : "Disabled"} staff account of ${s?.name}`;
            return `Edited staff account of ${s?.name}`;
          }
        );
      },
      removeStaff(id) {
        mutate(
          (p) => ({ ...p, staff: p.staff.filter((s) => s.id !== id) }),
          (p) => `Deleted staff account of ${p.staff.find((x) => x.id === id)?.name}`
        );
      },

      // ---------- admin: content ----------
      publishEvent(data) {
        const evt = { id: makeId("evt"), ...data };
        update("events", (list) => [evt, ...list]);
        return evt;
      },
      deleteEvent(id) {
        update("events", (list) => list.filter((e) => e.id !== id));
      },
      publishNews(data) {
        const n = { id: makeId("news"), date: new Date().toISOString().slice(0, 10), ...data };
        update("news", (list) => [n, ...list]);
        return n;
      },
      deleteNews(id) {
        update("news", (list) => list.filter((n) => n.id !== id));
      },
    };
  }, []);

  const currentMember = state.session.memberId
    ? state.members.find((m) => m.id === state.session.memberId) || null
    : null;

  const currentStaff = state.session.staffId
    ? (state.staff || []).find((s) => s.id === state.session.staffId && s.active) || null
    : null;
  const commissionStaff = state.session.commissionId
    ? (state.staff || []).find((s) => s.id === state.session.commissionId && s.active) || null
    : null;
  const can = (section) => !!currentStaff && (ROLES[currentStaff.role] || []).includes(section);

  const value = { state, actions, currentMember, currentStaff, commissionStaff, can };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
