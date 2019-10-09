const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/login",
  passport.authenticate("Keycloak", {
    scope: "openid email profile"
  }),
  (req, res) => res.redirect("/")
);

router.get("/callback", (req, res, next) => {
  console.log("in callback");
  passport.authenticate("Keycloak", (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login");
    req.logIn(user, err => {
      if (err) return next(err);
      console.log("successfully logged in", user);
      res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();

  const { KEYCLOAK_HOST, KEYCLOAK_REALM, PORT } = process.env;
  const kcUri = `${KEYCLOAK_HOST}/auth/realms/${KEYCLOAK_REALM}/protocol/openid-connect`;
  res.redirect(`${kcUri}/logout?redirect_uri=http://localhost:${PORT}`);
});

module.exports = router;
