const Koa = require('koa');
const Router = require('koa-router');
const { bodyParser } = require("@koa/bodyparser");
const cors = require('@koa/cors');
const session = require('koa-session');
const passport = require('koa-passport');
const mustBeAuthenticated = require('./libs/mustBeAuthenticated');
const authHandlers = require('./handlers/auth');
const movieHandlers = require('./handlers/movie');
const userHandlers = require('./handlers/user');

const app = new Koa();
const router = new Router();

app.keys = ['super-secret-key'];
app.use(session({secure: true, sameSite: "none"}, app));
app.use(cors({ credentials: true }));

app.use(bodyParser());

require('./libs/auth');
app.use(passport.initialize());
app.use(passport.session());

router.post('/user', authHandlers.signUp)
router.post('/auth/login', authHandlers.login);
router.get('/auth/logout', authHandlers.logout);

router.get('/movie/top10', movieHandlers.getTop10Movies);
router.get('/movie/random', movieHandlers.getRandomMovie);
router.get('/movie/genres', movieHandlers.getGenres);
router.get('/movie/:id', movieHandlers.getMovieDetails);
router.get('/movie', movieHandlers.getMoviesList);

router.get('/profile', mustBeAuthenticated, userHandlers.profile);
router.post('/favorites', mustBeAuthenticated, userHandlers.setFavorites);
router.delete('/favorites/:movieId', mustBeAuthenticated, userHandlers.deleteFavorites);
router.get('/favorites', mustBeAuthenticated, userHandlers.getFavorites);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);