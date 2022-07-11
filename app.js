if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//avoid database injection from query
const mongoSanitize = require("express-mongo-sanitize");

const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .catch((error) => handleError(error));

const app = express();

//ejs-mate is engine for boilerplate (creating layout file in views directory)
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//necessary for parsing req.body -- app.post
app.use(express.urlencoded({ extended: true }));
//to be able to use put and patch through method
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const sessionConfig = {
  //name is overriding default name connect.sid
  name: "session",
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //only for https; means cookie can only be configured over https
    //the app won't log user in if it's not https
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
//session has to be before passport.session according to passport docs
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
//persistent login session
app.use(passport.session());
//authentication method is prebuilt in passpor.js
//we can have multiple strategy at once, but currently we're only using localStrategy
passport.use(new LocalStrategy(User.authenticate()));

//store user in a session
passport.serializeUser(User.serializeUser());
//unstore user from a session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.query);
  //passport input the user in req
  //the req.user will display user infromation coming from the session
  //we can access user wherever we want in our app
  res.locals.currentUser = req.user;
  //putting the flash on local variables
  res.locals.success = req.flash("success");
  //instead of directing client to the error message, redirect them to campground index and flash error
  res.locals.error = req.flash("error");
  next();
});

app.get("/fakeUser", async (req, res) => {
  const user = new User({
    email: "fabiojonathan@gmail.com",
    username: "fabiojonathana",
  });
  //this is a convenient passport-local-mongoose method
  const newUser = await User.register(user, "chicken");
  res.send(newUser);
});

//to integrate with the routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
