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

const STORAGE_KEY = "sl-diaspora-platform-state-v1";

const CASE_PREFIX = {
  "New Passport Application": "NPP",
  "Passport Renewal": "PSP",
  "National ID Renewal": "NID",
  "Visa Application": "VSA",
  "Emergency Travel Certificate": "ETC",
};

function loadInitialState() {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { youthPosts: seedYouthPosts, ...JSON.parse(raw) };
    } catch {
      // fall through to seed
    }
  }
  return {
    members: seedMembers,
    professionals: seedProfessionals,
    jobs: seedJobs.map((j) => ({ ...j, applicants: [] })),
    businesses: seedBusinesses,
    consularCases: seedConsularCases,
    referrals: seedReferrals,
    events: seedEvents,
    news: seedNews,
    youthPosts: seedYouthPosts,
    session: { memberId: null, isAdmin: false },
  };
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
        };
        update("members", (list) => [...list, member]);
        setState((prev) => ({ ...prev, session: { memberId: id, isAdmin: false } }));
        return id;
      },
      login(email) {
        let found = null;
        setState((prev) => {
          found = prev.members.find(
            (m) => m.email.toLowerCase() === email.toLowerCase()
          );
          if (!found) return prev;
          return { ...prev, session: { memberId: found.id, isAdmin: false } };
        });
        return found;
      },
      logout() {
        setState((prev) => ({ ...prev, session: { memberId: null, isAdmin: false } }));
      },
      loginAdmin() {
        setState((prev) => ({ ...prev, session: { memberId: null, isAdmin: true } }));
      },
      logoutAdmin() {
        setState((prev) => ({ ...prev, session: { memberId: null, isAdmin: false } }));
      },

      // ---------- consular ----------
      submitConsularCase(memberId, { type, notes, details, payment }) {
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

  const value = { state, actions, currentMember };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
