import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { SECTIONS } from "../data/master";

export function MemberRoute({ children }) {
  const { currentMember } = useApp();
  if (!currentMember) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { state, commissionStaff } = useApp();
  const ok = state.session.isAdmin && (state.session.commissionId ? !!commissionStaff : true);
  if (!ok) return <Navigate to="/admin/login" replace />;
  return children;
}

export function StaffRoute({ section, children }) {
  const { currentStaff, can } = useApp();
  if (!currentStaff) return <Navigate to="/master/login" replace />;
  if (section && !can(section)) {
    const first = SECTIONS.find((s) => can(s.key));
    return <Navigate to={first ? first.to : "/master/login"} replace />;
  }
  return children;
}
