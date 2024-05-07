const bcrypt = require('bcryptjs');
const passport = require('koa-passport');
const prisma = require('../prisma');

const login = async (ctx) => {
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user);
        ctx.status = 200;
        ctx.body = { result: true };
      } else {
        ctx.status = 400;
        ctx.body = { result: false };
      }
    })(ctx);
};

const logout = async (ctx) => {
    ctx.logout(function(err) {
      if (err) {
        ctx.body = { result: false };
      } else {
        ctx.body = { result: true };
      }
    });
};

const signUp = async (ctx) => {
    const { request: { body: { email, password } } } = ctx;

    try {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
    
      await prisma.user.create({
        data: {
          email,
          password: hash,
          favorites: [],
        },
      });

      ctx.status = 200;
      ctx.body = { success: true };
    } catch (err) {
      ctx.body = err;
    }
};

module.exports = {
    login,
    logout,
    signUp,
};
