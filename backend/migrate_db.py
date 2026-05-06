import json
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

DB_PATH = "db.json"

def migrate():
    if not os.path.exists(DB_PATH):
        print(f"No {DB_PATH} found. Exiting.")
        return

    with open(DB_PATH, "r") as f:
        db = json.load(f)

    spots = db.get("spots", [])
    if not spots:
        print("No spots to migrate.")
        return

    print(f"Migrating {len(spots)} spots...")
    
    # We will let Postgres auto-generate the ID, or we can insert explicit IDs.
    # It's better to keep explicit IDs so any existing user saved spots might work 
    # (if we migrate users too). But db.json users saved spots with UUIDs, wait.
    # In db.json, users are stored as username/id keys -> {"saved_spots": [1, 2, 3]}
    
    # Since we are creating a new table, let's insert spots with their existing IDs
    # so saved spot references don't break if we migrate saved_spots.
    
    for spot in spots:
        # Check if it already exists
        existing = supabase.table("spots").select("id").eq("id", spot["id"]).execute()
        if existing.data:
            print(f"Spot {spot['id']} already exists, skipping.")
            continue
            
        print(f"Inserting spot {spot['name']}...")
        # Handle optional fields that might be missing or empty
        campus = spot.get("campus", None)
        if campus == "None" or not campus:
            campus = None
            
        new_spot = {
            "id": spot["id"],
            "name": spot["name"],
            "image": spot["image"],
            "rating": spot["rating"],
            "location": spot["location"],
            "status": spot["status"],
            "tags": spot.get("tags", []),
            "occupancy": spot["occupancy"],
            "campus": campus,
            "lat": spot.get("lat"),
            "lng": spot.get("lng"),
            "vibes": spot.get("vibes"),
            "info": spot.get("info")
        }
        
        res = supabase.table("spots").insert(new_spot).execute()
        
    print("Migrating users' saved spots...")
    users = db.get("users", {})
    for username, data in users.items():
        # Usually username is a UUID in the new auth, but we'll migrate whatever is there.
        # If it's a UUID, it works. If it's a legacy username, it works.
        saved_spots = data.get("saved_spots", [])
        for spot_id in saved_spots:
            # Check if exists
            existing = supabase.table("saved_spots").select("id").eq("user_id", username).eq("spot_id", spot_id).execute()
            if not existing.data:
                try:
                    supabase.table("saved_spots").insert({
                        "user_id": username,
                        "spot_id": spot_id
                    }).execute()
                    print(f"Saved spot {spot_id} for user {username}")
                except Exception as e:
                    print(f"Error saving spot {spot_id} for user {username}: {e}")

    print("Migration complete!")

if __name__ == "__main__":
    migrate()
