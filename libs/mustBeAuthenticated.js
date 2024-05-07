module.exports = function mustBeAuthenticated(ctx, next) {
    if (!ctx.isAuthenticated()) {
      ctx.throw(401, 'Please, log in');
    }

    return next();
};