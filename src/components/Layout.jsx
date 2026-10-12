import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useApp } from "../context/AppContext";

export default function Layout() {
  const { state } = useApp();
  const banner = state.siteSettings?.banner;
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {banner?.active && banner.text && (
        <div role="status" className="bg-gold px-4 py-2 text-center text-sm font-semibold text-green-dark">
          {banner.text}
        </div>
      )}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
