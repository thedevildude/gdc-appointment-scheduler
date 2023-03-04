const router = require("express").Router();
const homeRouter = require("express").Router({ mergeParams: true });
var passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const { hashPassword } = require("../lib/passwordUtils");
const { User, Event } = require("../models");
const { checkDateTime } = require("./middleware/helpers");

router.use("/dashboard", connectEnsureLogin.ensureLoggedIn(), homeRouter);

router.get("/", async (request, response) => {
  response.render("index");
});

// Helping Database Sync link: Should be removed during production
router.get("/sync", async (request, response) => {
  await User.sync({ alter: true });
  await Event.sync({ alter: true });
  request.flash("error", "Database Synced");
  response.redirect("/");
});

router.get("/reset", async (request, response) => {
  try {
    await User.destroy({
      where: {},
      truncate: false,
    });
    await Event.destroy({
      where: {},
      truncate: false,
    });
    request.flash("error", "All Users cleared");
    response.redirect("/");
  } catch (error) {
    request.flash("error", error.message);
    response.redirect("/");
  }
});

router.get("/signup", (request, response) => {
  response.render("signup", {
    csrfToken: request.csrfToken(),
    title: "Sign Up",
  });
});

router.get("/login", (request, response) => {
  response.render("login", {
    csrfToken: request.csrfToken(),
    title: "Login",
  });
});

// Sign Out or Log out route
router.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    request.flash("error", "Logged Out Successfully");
    response.redirect("/");
  });
});

homeRouter.get("/", (request, response) => {
  response.render("dashboard", {
    csrfToken: request.csrfToken(),
    title: "Dashboard",
  });
});

router.post("/signup", async (request, response) => {
  try {
    if (request.body.password.length < 1) {
      throw new Error("Password cannot be empty");
    }
    const passwordHash = await hashPassword(request.body.password);
    const user = await User.addUser({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      passwordHash,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/dashboard");
    });
  } catch (error) {
    request.flash("error", error.message);
    if (error.message == "Email is already registered") {
      return response.redirect("/login");
    } else return response.redirect("/signup");
  }
});

router.post(
  "/login",
  passport.authenticate("local-user", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    response.redirect("/dashboard");
  }
);

homeRouter.post("/schedule", checkDateTime, async (request, response) => {
  try {
    await Event.scheduleEvent({
      event_title: request.body.event_title,
      event_description: request.body.event_description,
      event_date: request.body.event_date,
      event_start: request.body.event_start,
      event_end: request.body.event_end,
      user_id: request.user.id
    });
    console.log("Event Scheduled");
    response.redirect("back")
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
