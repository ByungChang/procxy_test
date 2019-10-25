const local = require('./localStrategy');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.org_id);
  });

  passport.deserializeUser((org_id, done) => {
    User.findOne({ where: { org_id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
};
