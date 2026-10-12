import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { MemberRoute, AdminRoute } from "./components/ProtectedRoute";

import Landing from "./pages/public/Landing";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";
import AdminLogin from "./pages/public/AdminLogin";

import Dashboard from "./pages/member/Dashboard";
import Consular from "./pages/member/Consular";
import Referrals from "./pages/member/Referrals";
import Jobs from "./pages/member/Jobs";
import Businesses from "./pages/member/Businesses";
import Events from "./pages/member/Events";
import Profile from "./pages/member/Profile";
import Youth from "./pages/member/Youth";

import AdminOverview from "./pages/admin/AdminOverview";
import AdminVerification from "./pages/admin/AdminVerification";
import AdminConsular from "./pages/admin/AdminConsular";
import AdminReferrals from "./pages/admin/AdminReferrals";
import AdminListings from "./pages/admin/AdminListings";
import AdminContent from "./pages/admin/AdminContent";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/dashboard"
          element={
            <MemberRoute>
              <Dashboard />
            </MemberRoute>
          }
        />
        <Route
          path="/consular"
          element={
            <MemberRoute>
              <Consular />
            </MemberRoute>
          }
        />
        <Route
          path="/referrals"
          element={
            <MemberRoute>
              <Referrals />
            </MemberRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <MemberRoute>
              <Jobs />
            </MemberRoute>
          }
        />
        <Route
          path="/businesses"
          element={
            <MemberRoute>
              <Businesses />
            </MemberRoute>
          }
        />
        <Route
          path="/events"
          element={
            <MemberRoute>
              <Events />
            </MemberRoute>
          }
        />
        <Route
          path="/youth"
          element={
            <MemberRoute>
              <Youth />
            </MemberRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <MemberRoute>
              <Profile />
            </MemberRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminOverview />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/verification"
          element={
            <AdminRoute>
              <AdminVerification />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/consular"
          element={
            <AdminRoute>
              <AdminConsular />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/referrals"
          element={
            <AdminRoute>
              <AdminReferrals />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/listings"
          element={
            <AdminRoute>
              <AdminListings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <AdminRoute>
              <AdminContent />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Landing />} />
      </Route>
    </Routes>
  );
}

export default App;
