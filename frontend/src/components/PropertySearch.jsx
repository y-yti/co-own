import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import "./PropertySearch.css";

function PropertySearch({ onOpenProperty }) {
  const [location, setLocation] = useState("Bangalore");
  const [propertyTypes, setPropertyTypes] = useState({ residential: true, commercial: false });
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const locations = ["Bangalore", "Hyderabad", "Chennai"];

  // Validate search button state
  const isSearchDisabled = !location || (!propertyTypes.residential && !propertyTypes.commercial);

  // Update validation message
  useEffect(() => {
    if (!location) {
      setValidationMessage("Please select a location to search");
    } else if (!propertyTypes.residential && !propertyTypes.commercial) {
      setValidationMessage("Please select at least one property type");
    } else {
      setValidationMessage("");
    }
  }, [location, propertyTypes]);

  // Fetch all properties on mount
  useEffect(() => {
    async function fetchAllProperties() {
      try {
        const res = await fetch("http://localhost:8000/properties");
        const data = await res.json();
        setProperties(data.items || []);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties");
      }
    }
    fetchAllProperties();
  }, []);

  // Filter properties when search is triggered or filters change
  useEffect(() => {
    if (!hasSearched) return;

    setLoading(true);
    // Simulate instant filter with minimal delay for UX
    const timer = setTimeout(() => {
      const filtered = properties.filter((property) => {
        const matchesLocation = property.city === location;
        const matchesType =
          (propertyTypes.residential && property.type === "residential") ||
          (propertyTypes.commercial && property.type === "commercial");
        return matchesLocation && matchesType;
      });
      setFilteredProperties(filtered);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location, propertyTypes, properties, hasSearched]);

  const handleSearch = () => {
    if (isSearchDisabled) return;
    setHasSearched(true);
    setError(null);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="property-search">
      <div className="search-filters" role="search">
        <div className="filter-group">
          <label htmlFor="location-select">Location</label>
          <select
            id="location-select"
            value={location}
            onChange={handleLocationChange}
            aria-required="true"
          >
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <fieldset>
            <legend>Property Type</legend>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={propertyTypes.residential}
                  onChange={() => handlePropertyTypeChange("residential")}
                  aria-label="Residential properties"
                />
                <span>Residential</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={propertyTypes.commercial}
                  onChange={() => handlePropertyTypeChange("commercial")}
                  aria-label="Commercial properties"
                />
                <span>Commercial</span>
              </label>
            </div>
          </fieldset>
        </div>

        <button
          className="search-button"
          onClick={handleSearch}
          disabled={isSearchDisabled}
          aria-disabled={isSearchDisabled}
        >
          Search
        </button>
      </div>

      {validationMessage && (
        <div className="validation-message" role="alert" aria-live="polite">
          {validationMessage}
        </div>
      )}

      <div className="search-results" aria-live="polite" aria-atomic="true">
        {!hasSearched ? (
          <div className="empty-state">
            <p>Select your search criteria and click Search to find properties</p>
          </div>
        ) : loading ? (
          <div className="loading-state" aria-busy="true">
            <p>Searching properties...</p>
          </div>
        ) : error ? (
          <div className="error-state" role="alert">
            <p>{error}</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="empty-state">
            <p>
              No properties found for {location} {propertyTypes.residential && "residential"}
              {propertyTypes.residential && propertyTypes.commercial && " or "}
              {propertyTypes.commercial && "commercial"}
            </p>
          </div>
        ) : (
          <div className="results-container">
            <div className="results-header">
              <h3>
                {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found
              </h3>
              <p className="results-summary">
                {location} · {propertyTypes.residential && "Residential"}
                {propertyTypes.residential && propertyTypes.commercial && " · "}
                {propertyTypes.commercial && "Commercial"}
              </p>
            </div>
            <div className="property-grid">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} onOpenProperty={onOpenProperty} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertySearch;
