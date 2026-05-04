from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI()

# Allow CORS for Next.js frontend running locally
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "db.json"

# Helper to read database safely
def load_db():
    if not os.path.exists(DB_PATH):
        # Default empty structure if db doesn't exist
        return {"spots": [], "users": {}}
    with open(DB_PATH, "r") as f:
        return json.load(f)

# Helper to save database
def save_db(data):
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=4)

# Pydantic schema for validation
class Spot(BaseModel):
    name: str
    image: str
    rating: float
    location: str
    status: str
    tags: List[str]
    occupancy: str
    campus: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    vibes: Optional[str] = ""
    info: Optional[str] = ""

# Retrieve all study spots available in the database.
@app.get("/spots")
def get_spots():
    db = load_db()
    return db.get("spots", [])

# Retrieves a single study spot by its ID.
@app.get("/spots/{spot_id}")
def get_spot(spot_id: int):
    db = load_db()
    spots = db.get("spots", [])
    spot = next((s for s in spots if s["id"] == spot_id), None)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")
    return spot


# Adds a study spot to the website data globally.
@app.post("/spots")
def create_spot(spot: Spot):
    db = load_db()
    spots = db.setdefault("spots", [])
    
    # Calculate an auto-incrementing ID safely
    new_id = max([s["id"] for s in spots] + [0]) + 1
    new_spot = spot.model_dump()
    new_spot["id"] = new_id
    
    spots.append(new_spot)
    save_db(db)
    return new_spot

# Adds a bookmark for a specific user to their saved list.
@app.post("/users/{username}/saved/{spot_id}")
def save_spot_for_user(username: str, spot_id: int):
    db = load_db()
    users = db.setdefault("users", {})
    user = users.setdefault(username, {"saved_spots": []})
    
    if spot_id not in user["saved_spots"]:
        user["saved_spots"].append(spot_id)
        
    save_db(db)
    return {"status": "success", "saved_spots": user["saved_spots"]}

# Removes a bookmark from a user's saved list.
@app.delete("/users/{username}/saved/{spot_id}")
def remove_spot_for_user(username: str, spot_id: int):
    db = load_db()
    users = db.setdefault("users", {})
    user = users.setdefault(username, {"saved_spots": []})
    
    if spot_id in user["saved_spots"]:
        user["saved_spots"].remove(spot_id)
        
    save_db(db)
    return {"status": "success", "saved_spots": user["saved_spots"]}

# Gets the spot objects for all spots a user has saved.
@app.get("/users/{username}/saved")
def get_saved_spots(username: str):
    db = load_db()
    users = db.get("users", {})
    # Extract list of IDs the user bookmarked
    user_saved_ids = users.get(username, {}).get("saved_spots", [])
    
    all_spots = db.get("spots", [])
    # Filter the global spots returning only those that match user's saved IDs
    saved_spots = [s for s in all_spots if s["id"] in user_saved_ids]
    
    return saved_spots
