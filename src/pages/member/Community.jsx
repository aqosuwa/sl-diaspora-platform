import { useState } from "react";
import { CHAT_ROOMS } from "../../data/master";
import ChatRoom from "../../components/ChatRoom";

export default function Community() {
  const rooms = CHAT_ROOMS.filter((r) => !r.hidden);
  const [room, setRoom] = useState(rooms[0].key);
  const current = rooms.find((r) => r.key === room);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-charcoal">Community</h1>
      <p className="mt-1 text-sm text-muted">
        Talk with other members. Be respectful. Messages that break the rules are removed by moderators.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="flex gap-2 overflow-x-auto md:flex-col" role="tablist" aria-label="Chat rooms">
          {rooms.map((r) => (
            <button
              key={r.key}
              role="tab"
              aria-selected={room === r.key}
              onClick={() => setRoom(r.key)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                room === r.key ? "bg-green text-white shadow-card" : "bg-white text-charcoal ring-1 ring-green-dark/[0.08] hover:bg-green-50"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <ChatRoom room={current.key} title={current.label} blurb={current.blurb} />
      </div>
    </div>
  );
}
