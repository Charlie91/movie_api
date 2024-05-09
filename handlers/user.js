const mapMovieModel = require('../libs/mapMovieModel');
const prisma = require('../prisma');

const profile = async (ctx) => {
    const { req: { user: { email, favorites, name, surname, } } } = ctx;
  
    ctx.body = {
      email,
      favorites,
      name,
      surname,
    };
};

const setFavorites = async (ctx) => {
    try {
      const { request: { body: { id: movieId } }, req: { user } } = ctx;

      const movieToAddToFavorites = await prisma.movie.findUnique({
        where: {
          tmdbId: +movieId,
        },
      });
    
      if (!movieToAddToFavorites) {
        ctx.status = 400;
        ctx.body = {
          error: 'Wrong movie Id',
        };
        return;
      }
    
      if (user.favorites.includes(movieId)) {
        ctx.status = 400;
        ctx.body = {
          error: 'This movie is already in favorites',
        };
        return;
      }
    
      const result = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          favorites: {
            push: movieId,
          },
        },  
      })
      ctx.body = result;  
    } catch (e) {
      ctx.status = 400;
      ctx.body = 'Bad request';
    }
};

const deleteFavorites = async ctx => {
    try {
      const { params, req: { user } } = ctx;

      const result = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          favorites: user.favorites.filter(favoriteMovieId => favoriteMovieId !== params.movieId),
        },  
      });

      ctx.body = result;
    } catch (e) {
      ctx.body = e;
    }
};

const getFavorites = async ctx => {
  try {
    const { req: { user: { favorites } } } = ctx;
  
    const result = await prisma.movie.findMany({
      where: {
        tmdbId: { in: favorites.map(id => +id) },
      },
    });
  
    ctx.body = result.map(mapMovieModel);
  } catch(e) {
    ctx.body = e;
  }
};

module.exports = {
    profile,
    setFavorites,
    deleteFavorites,
    getFavorites,
}