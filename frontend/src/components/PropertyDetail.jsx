import { useState, useEffect } from "react";
import "./PropertyDetail.css";

function PropertyDetail({ property, onClose }) {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPropertyDetails() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/properties/${property.id}/details`);
        if (!res.ok) {
          throw new Error("Failed to fetch property details");
        }
        const data = await res.json();
        setPropertyDetails(data);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    }

    fetchPropertyDetails();
  }, [property.id]);

  // Generate Google Maps iframe URL
  const mapUrl = `https://www.google.com/maps?q=${property.lat},${property.lng}&output=embed`;

  // Placeholder image for apartment complex
  const apartmentImageUrl = `https://via.placeholder.com/600x400/4A90E2/FFFFFF?text=${encodeURIComponent(property.name)}`;

  return (
    <div className="property-detail-container">
      <div className="property-detail-header">
        <h2>{property.name}</h2>
      </div>

      {loading ? (
        <div className="loading-state">Loading property details...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <>
          {/* First Row: Map and Image */}
          <div className="detail-row-1">
              <div className="map-container">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${property.name}`}
                ></iframe>
              </div>
              <div className="image-container">
                <img
                  src={apartmentImageUrl}
                  alt={`${property.name} complex`}
                  className="apartment-image"
                />
                <div className="image-overlay">
                  <p>{property.address}</p>
                </div>
              </div>
            </div>

            {/* Second Row: Units Table */}
            <div className="detail-row-2">
              <h3>Available Units</h3>
              {propertyDetails?.open_offers_summary?.units_available?.length > 0 ? (
                <table className="units-table">
                  <thead>
                    <tr>
                      <th>Unit ID</th>
                      <th>Floor</th>
                      <th>Area (sqft)</th>
                      <th>Asking Price/sqft</th>
                      <th>Status</th>
                      <th>Available Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyDetails.units
                      .filter((unit) => unit.has_open_offer)
                      .map((unit) => (
                        <tr key={unit.unit_id}>
                          <td className="unit-id">{unit.unit_id}</td>
                          <td>{unit.floor}</td>
                          <td>{unit.area_sft}</td>
                          <td>₹{unit.asking_price_per_sft?.toLocaleString()}</td>
                          <td>
                            <span className={`status-badge ${unit.status}`}>
                              {unit.status === "partially_sold"
                                ? "Partially Available"
                                : "Available"}
                            </span>
                          </td>
                          <td>
                            {unit.status === "partially_sold"
                              ? `${unit.available_units} of ${unit.total_fractional_units}`
                              : `${unit.min_investment_units}-${unit.max_investment_units}`}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-units">No units available for investment at this time.</div>
              )}

              {propertyDetails?.recent_transaction?.length > 0 && (
                <div className="transaction-summary">
                  <h4>Recent Transaction</h4>
                  <p>
                    Last sold: <strong>₹{propertyDetails.recent_transaction[propertyDetails.recent_transaction.length - 1].price_per_sft.toLocaleString()}/sqft</strong> on{" "}
                    {new Date(propertyDetails.recent_transaction[propertyDetails.recent_transaction.length - 1].date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
    </div>
  );
}

export default PropertyDetail;
