const passport = require("passport");

exports.logout = async (req, res, next) => {
  req.logout(() => {
    res.redirect("/");
  });
};
