import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/40">
                <Icon name="shield" size={15} />
              </span>
              <span className="text-[15px] font-bold">Diaspora Connect</span>
            </div>
            <p className="mt-3 text-sm text-white/70">
              Connecting the Sierra Leonean diaspora in the UK with the Sierra
              Leone High Commission — consular services, trusted professionals,
              and each other.
            </p>
          </div>
          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Services</span>
              <Link to="/jobs" className="text-white/70 hover:text-white hover:underline">Jobs board</Link>
              <Link to="/businesses" className="text-white/70 hover:text-white hover:underline">Business directory</Link>
              <Link to="/events" className="text-white/70 hover:text-white hover:underline">Events & news</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold">Account</span>
              <Link to="/login" className="text-white/70 hover:text-white hover:underline">Log in</Link>
              <Link to="/register" className="text-white/70 hover:text-white hover:underline">Register</Link>
              <Link to="/admin/login" className="text-white/70 hover:text-white hover:underline">Commission staff login</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flag-band">
        <span className="s1" />
        <span className="s2" />
        <span className="s3" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <p className="text-xs text-white/60">
          © 2026 Sierra Leone High Commission, UK
        </p>
      </div>
    </footer>
  );
}
