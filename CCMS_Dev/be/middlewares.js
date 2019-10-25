exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    
    next();
  } else {
    console.log('로그인안돼있음')
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};
  