import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


BASE_DIR = Path(__file__).resolve().parent
PROPERTIES_FILE = BASE_DIR / "properties" / "properties.json"


def load_properties() -> list[dict]:
    """Load property data from properties/properties.json.

    Falls back to an empty list if the file is missing or invalid,
    so that the API still responds gracefully.
    """
    try:
        with PROPERTIES_FILE.open("r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, list):
            return []
        return data
    except Exception:
        # In a small demo app it's fine to swallow errors; in a
        # real app you'd log this.
        return []


def load_property_details(property_id: int) -> dict | None:
    """Load detailed property data from property_{id}_details.json.
    
    Returns None if the file doesn't exist or is invalid.
    """
    try:
        details_file = BASE_DIR / "properties" / f"property_{property_id}_details.json"
        if not details_file.exists():
            return None
        with details_file.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception:
        return None


app = FastAPI()

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/properties")
def get_properties(
    property_type: str | None = None,
    city: str | None = None,
):
    properties = load_properties()
    results = properties
    
    # Filter by property type if specified
    if property_type:
        results = [
            p for p in results
            if p.get("type", "").lower() == property_type.lower()
        ]
    
    # Filter by city if specified
    if city:
        results = [
            p for p in results
            if p.get("city", "").lower() == city.lower()
        ]
    
    return {"items": results}


@app.get("/properties/{property_id}/details")
def get_property_details(property_id: int):
    """Get detailed information about a specific property including units and transactions."""
    details = load_property_details(property_id)
    
    if details is None:
        raise HTTPException(
            status_code=404, 
            detail=f"Property details not found for property ID {property_id}"
        )
    
    return details
