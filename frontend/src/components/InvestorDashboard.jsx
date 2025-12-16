import PropertySearch from "./PropertySearch";
import "./InvestorDashboard.css";

function InvestorDashboard({ userName }) {
  const initials =
    userName
      .split(" ")
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?";

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <div>
          <h2>Co-own Investor</h2>
          <p className="header-subtitle">
            Search for properties across multiple cities
          </p>
        </div>
        <div className="profile-chip">
          <div className="profile-avatar">{initials}</div>
          <span className="profile-name">{userName}</span>
        </div>
      </header>

      <main className="dashboard-main">
        <PropertySearch />
      </main>
    </div>
  );
}

export default InvestorDashboard;
