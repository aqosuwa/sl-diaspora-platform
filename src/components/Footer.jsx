import { Link } from "react-router-dom";
import Icon from "./Icon";

const col = "flex flex-col gap-2.5 text-sm";
const item = "text-white/70 transition hover:text-white";

export default function Footer() {
  return (
    <footer className="bg-green-dark text-white">
      <div className="flag-band">
        <span className="s1" />
        <span className="s2" />
        <span className="s3" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gold">
                <Icon name="shield" size={19} />
              </span>
              <span className="font-display text-lg font-extrabold">Diaspora Connect</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              The Sierra Leone High Commission&rsquo;s online home for Sierra Leoneans in the UK:
              consular services, trusted professionals, and each other.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div className={col}>
              <span className="font-semibold text-white">Services</span>
              <Link to="/consular" className={item}>Consular services</Link>
              <Link to="/referrals" className={item}>Referrals</Link>
              <Link to="/jobs" className={item}>Jobs board</Link>
            </div>
            <div className={col}>
              <span className="font-semibold text-white">Community</span>
              <Link to="/businesses" className={item}>Business directory</Link>
              <Link to="/events" className={item}>Events &amp; news</Link>
              <Link to="/youth" className={item}>Youth connection</Link>
            </div>
            <div className={col}>
              <span className="font-semibold text-white">Account</span>
              <Link to="/login" className={item}>Log in</Link>
              <Link to="/register" className={item}>Register</Link>
              <Link to="/admin/login" className={item}>Commission staff login</Link>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-5">
          <p className="text-xs text-white/55">&copy; 2026 Sierra Leone High Commission, UK</p>
        </div>
      </div>
    </footer>
  );
}
