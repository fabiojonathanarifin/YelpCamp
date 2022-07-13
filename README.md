# YelpCamp

A full-stack, fully responsive web application that allows user to register, post, rate and review campground spots around the US. Built with HTML, CSS, Javascript, Bootstrap, Express, Mongoose, MonggoDB, and NodeJS. CRUD functionalities using Database. RESTful API.

    
💡Lessons Learned
First full-stack web application
Introduction to Express.js
Introduction to MongoDB database design
Introduction to Bootstrap 5
Optimizing performance, security, and accessibility using Google Lighthouse
Integration testing with Jest
Automated code review with Codacy and CodeClimate
Continuous Integration and Continuous Deployment with CircleCI
Deploying app to Heroku and Database to MongoDB Atlas
Cloudflare as a Content Delivery Network in conjunction with custom Google Domain and Heroku
Creating the background SVG illustration with Inkscape
🛠 Technologies
Graphic Design	Front-End	Back-End	Database	Deployment	Testing
Inkscape	HTML5	Node.js	Mongoose	Heroku	Jest
.	CSS3	ExpressJS	MongoDB	MongoDB Atlas	Lighthouse
.	Bootstrap 5	EJS	.	Cloudflare	.
.	Javascript	.	.	Git	.
⚖️ Methodology
Used a Model-View-Controller (MVC) Monolithic Architecture since it's the most simple architecture to gain an introduction to full-stack web development. Building a MVC Monolith allows one to gain a perspective on the range of achitectures, particularly the lower-end of the range. The Monolith Architecture falls short in scalability and separation of front-end and back-end. The MVC Architecture falls short when the application begins to grow in complexity with the addition of services that could stand on thier own. The MVC Architecture is perhaps best used for simple proof-of-concept projects, like this one.
Developed and maintain the app in GoormIDE to gain exposure to a cloud-based IDE.
Bootstrap 5 as the CSS framework to keep the UI simple and quick to build. Since the website takes a performance hit for loading Bootstrap, took full advantage of advanced Bootstrap features such as custom validation for all forms and animated form input for the login and register pages.
Express.js as the Node.js application framework since it's a lightweight framework, which is ideal for gaining an understanding of how to build the backend from scratch. Compared to a framework like Nest.js or even Django, Express.js doesn't have many features out of the box.
PassportJs for the authentication and authorization.
NoSQL database for the flexibility compared to a SQL database, MongoDB in particular because of its prevalence in the industry.
Embedded Javascript Templates (EJS) as the front-end templating language for more DRY code compared to plain HTML and for dynamic user-experiences. This is a simple templating language, similar to Jinja for Python. Both however fall short on front-end scalability, modularity, and performance compared to a framework like React. Working with simple templating languges helps to remind me the benefits of working with a framework like React.
Heroku as the cloud hosting provider to gain experience with PaaS. Since I'm using the free tier, which normally causes the application to sleep after 30 minutes of inactivity, the application is kept awake from 6:00 a.m. to 11:59 p.m. PST with Kaffeine.
Cloudflare as the Content Delivery Network to serve users outside of the U.S. with faster load times and for the free SSL certificate, which is needed for domain forwarding to https://www.yelpcamp.app. Cloudflare also offers improved security and performance over the defaults in Google Domains.
Inkscape to create SVG illustrations from scratch to gain a deeper understanding of SVG. I don't plan on creating SVG graphics from scratch often, but now that I know how to do it, I can easily edit existing SVGs. If I'm unable to find an open-source SVG, now I can always create one exactly as needed.
⚙️ Features
Login, sign-up, Admin role
RESTful routes (Create, Read, Update, Delete) for campgrounds, comments, and reviews
Create and Update forms have both client-side and server-side validation
Create routes have authentication
Update, and Delete routes have authentication and authorization
Google Maps API
