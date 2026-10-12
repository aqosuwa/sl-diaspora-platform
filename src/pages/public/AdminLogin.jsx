import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Icon from "../../components/Icon";

export default function AdminLogin() {
  const { actions } = useApp();
  const navigate = useNavigate();

  function handleLogin() {
    actions.loginAdmin();
    navigate("/admin");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue/10 text-blue">
        <Icon name="shield" size={22} />
      </span>
      <h1 className="mt-4 font-serif text-2xl font-bold text-charcoal">
        Commission staff login
      </h1>
      <p className="mt-2 text-sm text-muted">
        This area is for Sierra Leone High Commission, UK caseworkers and
        administrators.
      </p>
      <button
        onClick={handleLogin}
        className="mt-6 w-full rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-dark"
      >
        Enter admin dashboard
      </button>
      <p className="mt-5 text-sm text-muted">
        Not Commission staff?{" "}
        <Link to="/login" className="font-medium text-green hover:underline">
          Member login
        </Link>
      </p>
    </div>
  );
}
