import "./PropertyCard.css";

function PropertyCard({ property }) {
  const {
    name,
    address,
    area_sft,
    price_per_sft,
    city,
    type,
  } = property;

  const totalPrice = area_sft * price_per_sft;

  return (
    <div className="property-card">
      <div className="property-tag">
        {type.charAt(0).toUpperCase() + type.slice(1)} · {city}
      </div>
      <h3 className="property-title">{name}</h3>
      <p className="property-address">{address}</p>

      <div className="property-meta">
        <div>
          <span className="label">Area</span>
          <span className="value">{area_sft} sft</span>
        </div>
        <div>
          <span className="label">Price/sft</span>
          <span className="value">₹ {price_per_sft.toLocaleString()}</span>
        </div>
        <div>
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
