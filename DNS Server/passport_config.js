const { Strategy, ExtractJwt } = require("passport-jwt");
const db = require("./DB_Models/index");
require("dotenv").config();
const DB = require("./DB_Models/index");
const Users = db.users;

const SECRET = process.env.JWT_SECRET;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Bearer"),
  secretOrKey: "SECRET",
};
const PassportConfig = (passport) => {
  console.log("Inside passport");
  passport.use(
    new Strategy(opts, (payload, done) => {
      console.log(payload);
      Users.findByPk(payload.user_name)
        .then((user) => {
          if (user) {
            return done(null, {
              user_name: user.user_name,
            });
          }
          return done(null, false);
        })
        .catch((err) => console.error(err));
    })
  );
};

module.exports = (passport) => {
  return PassportConfig(passport);
};
