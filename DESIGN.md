# How It Ended
I was able to impelement most of what I wanted. I did succeed in all the goals that had to be done, as well as some of the better and best goals, but not all of them. 

# The Setup
I used:
- Python/FastAPI for the backend
    - I have used python before and it seemed like a good choice for the project that I am doing.
- Next.js/TypeScript for the frontend
    - I chose this for it's usability and the code logic is very similar to html which I have used in the past.
- Supabase for the database
    - I already had a supabase account and knew some of how to use it, so it made sense to use it for this project as well.
- Vercel for the deployment
    - It is a free, easy to use option with the ability to link to your Supabase account, Which makes it better. 

# The Pages

### Homepage
There is the homepage, which shows all the spots, the map, and allows you to search and filter through spots. The map shows pins for where the spots are, you can look at the spots by clicking veiw which will take you to the where the spot is in the list.
From the spots list, you can click on a spot to go to the spot's page. The homepage also has a way to get to the saved spots page and profile page. Both of which will direct you to login if you have not already done so. Each small veiw spots card allows you
to save and unsave spots wherever it appears. 

### Saved Spots Page
This shows the spots that the user has saved. It shows up as cards that you can click on which will take you to that spot's page.

### Spots Page
This page gives more information about the spot, allows you to save or unsave it, and has a 'Get Directions' button which takes you to Google Maps with the directions to the spot.

### Profile Page
This page allows you to change your avatar, username, email, password, and the campus you attend. It has a button that will take you to the saved spots page and one that takes you to the add spots page, as well as a logout button. 

### Add Spots Page
This page allows any user to add a spot that they wish. They are able to put in the name, the campus it is near, an image, the address, hours, occupancy, rating, some key amenities, as well as custom adding amenities, and some extra cool info about the place. 

### Campus Page
This allows the user to look at spots that are near to their campus. If their campus is in the list. 

### Map Page
This is strictly for a mobile user. An extra button on a floating bar navigation will take you to a page with the map as it is too big to simply display on the homepage.

### Login Page
This page allows you to login with your email and a password. If you have never logged in before, it has a button to take you to a Create An Account page. 