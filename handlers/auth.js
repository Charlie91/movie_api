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
    try {
      const { request: { body: { email, password, name, surname } } } = ctx;

      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
    
      await prisma.user.create({
        data: {
          email,
          password: hash,
          name,
          surname,
          favorites: [],
        },
      });

      ctx.status = 200;
      ctx.body = { success: true };
    } catch (err) {
      if (err.code === 'P2002') {
        ctx.status = 409;
        ctx.body = {
          error: 'User already exists'
        };  
      } else {
        ctx.status = 400;
        ctx.body = {
          error: 'Registration has not succeed, check the correction of all passed data'
        };  
      }
    }
};

module.exports = {
    login,
    logout,
    signUp,
};
