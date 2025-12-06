import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import "./InvestorDashboard.css";

function InvestorDashboard({ userName }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch(
          "http://localhost:8000/properties?property_type=residential&city=Bangalore"
        );
        const data = await res.json();
        setProperties(data.items || []);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

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
            Default criteria: Residential · Bangalore
          </p>
        </div>
        <div className="profile-chip">
          <div className="profile-avatar">{initials}</div>
          <span className="profile-name">{userName}</span>
        </div>
      </header>

      <main className="dashboard-main">
        {loading ? (
          <p>Loading properties…</p>
        ) : properties.length === 0 ? (
          <p>No properties found for Bangalore residential.</p>
        ) : (
          <div className="property-grid">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default InvestorDashboard;
