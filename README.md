# Study-Spots
Abigail Hochstetler's Final Project '26 for CS50!

This is a website that shows different study spots in Boston. Users can veiw and add spots to the website while they are signed in with an email. 
It uses:
- Next.js/TypeScript (Frontend)
- Python/FastAPI (Backend)
- Supabase (Database)
- Vercel (Deployment)

## How to Use
Currently anyone who has the link to the website can create an account and use it, without needing any special access.

It is able to be used without logging in, but you will not be able to save spots, or have a profile. Logging in requirs an email and a password. 
Once logged in, you will have access to all the features of the website including: saving spots to a saved page, searching for places close to you, using the map, searching for places near your campus, editing your profile and adding spots that everyone will be able to see. The only way to edit or delete spots is through the Supabase account holder, which would be me.
I added contact information at the bottom of the profile page for this purpose. 
The 'Get Directions' is not always 100% accurate with your current location, but it will be correct for where you are going. You only need to change your starting point. 

## Installation
### Requirements:
- Python 3.11
- Node.js 18.0.0 or higher
- Supabase CLI
- Pip

### Getting Started
1. Download all project files to a folder.
2. Run these commands in the terminal:
  - pip install -r requirements.txt
  - cd into the backend folder and run 'uvicorn main:app --reload'
  - Then if there are no errors, in a second terminal, cd into the frontend folder and run 'npm run dev'
3. There should be a link in the terminal that allows you to access the website.
