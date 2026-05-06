from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI()

# Allow CORS for Next.js frontend running locally
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
SUPABASE_URL: str = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY environment variables in Vercel")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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
    response = supabase.table("spots").select("*").order("id", desc=False).execute()
    return response.data

# Retrieves a single study spot by its ID.
@app.get("/spots/{spot_id}")
def get_spot(spot_id: int):
    response = supabase.table("spots").select("*").eq("id", spot_id).execute()
    spots = response.data
    if not spots:
        raise HTTPException(status_code=404, detail="Spot not found")
    return spots[0]


# Adds a study spot to the database.
@app.post("/spots")
def create_spot(spot: Spot):
    new_spot = spot.model_dump()
    
    # Supabase will handle the auto-incrementing ID.
    response = supabase.table("spots").insert(new_spot).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create spot")
        
    return response.data[0]

# Adds a bookmark for a specific user to their saved list.
@app.post("/users/{username}/saved/{spot_id}")
def save_spot_for_user(username: str, spot_id: int):
    # Check if spot exists
    spot_res = supabase.table("spots").select("id").eq("id", spot_id).execute()
    if not spot_res.data:
         raise HTTPException(status_code=404, detail="Spot not found")
         
    # Upsert to avoid duplicate errors if already saved
    response = supabase.table("saved_spots").upsert({
        "user_id": username,
        "spot_id": spot_id
    }, on_conflict="user_id,spot_id").execute()
    
    return {"status": "success"}

# Removes a bookmark from a user's saved list.
@app.delete("/users/{username}/saved/{spot_id}")
def remove_spot_for_user(username: str, spot_id: int):
    response = supabase.table("saved_spots").delete().eq("user_id", username).eq("spot_id", spot_id).execute()
    return {"status": "success"}

# Gets the spot objects for all spots a user has saved.
@app.get("/users/{username}/saved")
def get_saved_spots(username: str):
    # Relational query: get saved_spots and join with spots table
    response = supabase.table("saved_spots").select("spot_id, spots(*)").eq("user_id", username).execute()
    
    # Extract the spots from the nested result
    saved_spots = [item["spots"] for item in response.data if item.get("spots")]
    
    return saved_spots
