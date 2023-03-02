const express = require("express");
const app = express();
const path = require("path");
const csurf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("any secret string"));
app.use(
  session({
    secret: "any secret string",
    /* store: sessionStore, */
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

/* Middleware to remove the trailing "/" from a route */
app.use((request, response, next) => {
  if (request.path.slice(-1) == "/" && request.path.length > 1) {
    const query = request.url.slice(request.path.length);
    response.redirect(301, request.path.slice(0, -1) + query);
  } else {
    next();
  }
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(csurf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

/* Routes */
app.get("/", (request, response) => {
  response.render("index.ejs");
});

module.exports = app;