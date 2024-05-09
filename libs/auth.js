const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const prisma = require("../prisma");
const bcrypt = require('bcryptjs');

const options = {
    usernameField: 'email',
    passwordField: 'password'
};

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findFirst({ where: { id } });

        if (user) done(null, user);    
    } catch (err) {
        done(err, null);
    }
});

passport.use(
  new LocalStrategy(options, async (email, password, done) => {
    try {
      const user = await prisma.user.findFirst({ where: { email } });

      if (!user) return done(null, false);

      if (bcrypt.compareSync(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  })
);
