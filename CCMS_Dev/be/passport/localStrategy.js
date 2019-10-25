const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'org_id',
    passwordField: 'user_pw',
    
  }, async (org_id, user_pw, done) => {
    try {
      const exUser = await User.findOne({ where: { org_id } });
      if (exUser) {
        //const result = await bcrypt.compare(user_pw, exUser.user_pw);
        let result = 0;

        if(exUser.user_pw.toString() == user_pw){
          result = 1;
        }
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
