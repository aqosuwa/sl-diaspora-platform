import { useApp } from "../../context/AppContext";
import AdminNav from "../../components/AdminNav";
import Card from "../../components/Card";
import StatusPill from "../../components/StatusPill";
import EmptyState from "../../components/EmptyState";

function ModerationButtons({ status, onApprove, onReject }) {
  if (status === "published")
    return (
      <button onClick={onReject} className="text-xs font-medium text-red-600 hover:underline">
        Unpublish
      </button>
    );
  return (
    <div className="flex gap-2">
      <button
        onClick={onApprove}
        className="rounded-lg bg-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-dark"
      >
        Approve
      </button>
      <button
        onClick={onReject}
        className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-black/5"
      >
        Reject
      </button>
    </div>
  );
}

export default function AdminListings() {
  const { state, actions } = useApp();

  function memberFor(id) {
    return state.members.find((m) => m.id === id);
  }

  const jobs = [...state.jobs].sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
  const businesses = state.businesses;

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Jobs & Business Moderation</h1>
        <p className="mt-1 text-sm text-muted">Approve or reject member-submitted listings.</p>

        <div className="mt-8">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Jobs</h2>
          <div className="mt-3 space-y-3">
            {jobs.length === 0 ? (
              <EmptyState title="No job listings" />
            ) : (
              jobs.map((j) => {
                const poster = j.postedBy ? memberFor(j.postedBy) : null;
                return (
                  <Card key={j.id} className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-charcoal">{j.title}</div>
                      <div className="text-xs text-muted">
                        {j.company} · {j.city} · {j.applicants?.length || 0} applicant(s)
                        {poster && ` · posted by ${poster.fullName}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusPill status={j.status} />
                      <ModerationButtons
                        status={j.status}
                        onApprove={() => actions.setJobStatus(j.id, "published")}
                        onReject={() => actions.setJobStatus(j.id, "rejected")}
                      />
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Businesses</h2>
          <div className="mt-3 space-y-3">
            {businesses.length === 0 ? (
              <EmptyState title="No business listings" />
            ) : (
              businesses.map((b) => (
                <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-charcoal">{b.name}</div>
                    <div className="text-xs text-muted">
                      {b.category} · {b.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill status={b.status} />
                    <ModerationButtons
                      status={b.status}
                      onApprove={() => actions.setBusinessStatus(b.id, "published")}
                      onReject={() => actions.setBusinessStatus(b.id, "rejected")}
                    />
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
