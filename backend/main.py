import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


BASE_DIR = Path(__file__).resolve().parent
PROPERTIES_FILE = BASE_DIR / "properties.json"


def load_properties() -> list[dict]:
    """Load property data from properties.json.

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
    property_type: str = "residential",
    city: str = "Bangalore",
):
    properties = load_properties()
    results = [
        p
        for p in properties
        if p.get("type", "").lower() == property_type.lower()
        and p.get("city", "").lower() == city.lower()
    ]
    return {"items": results}
