The seeds file create and randomized data for the YelpCamp app

cities = list of cities and location
seedHelpers = mixmatch and randomize name
index = integrate with Schema in models/campground to create the data and save it into MongoDB server

To access server:
-open Powershell
-type mongo
-type use yelp-camp (server name)
-type db.campgrounds.find() to access the seed data