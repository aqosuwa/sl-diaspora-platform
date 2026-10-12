import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function MemberRoute({ children }) {
  const { currentMember } = useApp();
  if (!currentMember) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { state } = useApp();
  if (!state.session.isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
