const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(404).send("로그인 필요");
  }
};

const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(404).send("로그인하였음");
  }
};

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
};
