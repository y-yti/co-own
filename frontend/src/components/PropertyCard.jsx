import "./PropertyCard.css";

function PropertyCard({ property }) {
  const {
    name,
    address,
    area_sft,
    price_per_sft,
    city,
    type,
    lat,
    lng,
  } = property;

  const totalPrice = area_sft * price_per_sft;

  // Validate coordinates and generate Google Maps URL
  const hasCoordinates = lat != null && lng != null;
  const googleMapsUrl = hasCoordinates ? `https://www.google.com/maps?q=${lat},${lng}` : '';

  const handleMapClick = () => {
    if (hasCoordinates) {
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="property-card">
      <div className="property-tag">
        {type.charAt(0).toUpperCase() + type.slice(1)} · {city}
      </div>
      
      <div className="property-header">
        <h3 className="property-title">{name}</h3>
        {hasCoordinates && (
          <button 
            className="map-icon-btn" 
            onClick={handleMapClick}
            aria-label="View on Google Maps"
            title="View on Google Maps"
          >
            <svg 
              className="map-icon" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </button>
        )}
      </div>
      
      <p className="property-address">{address}</p>

      <div className="property-meta">
        <div className="meta-item">
          <span className="label">Area</span>
          <span className="value">{area_sft} sft</span>
        </div>
        <div className="meta-item">
          <span className="label">Price/sft</span>
          <span className="value">₹ {price_per_sft.toLocaleString()}</span>
        </div>
        <div className="meta-item">
          <span className="label">Approx Total</span>
          <span className="value">₹ {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <button className="btn-outline" disabled>
        View & Make Offer (stub)
      </button>
    </div>
  );
}

export default PropertyCard;
