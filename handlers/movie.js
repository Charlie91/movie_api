const prisma = require('../prisma');

const getRandomMovie = async (ctx) => {
    const count = await prisma.movie.count();
    const skip = Math.floor(Math.random() * count);
    const movie = await prisma.movie.findMany({
        take: 1,
        skip: skip,
    });

    ctx.body = movie[0];
};

const getGenres = async (ctx) => {
    const result = await prisma.$queryRaw`SELECT distinct unnest(genres) FROM "Movie"`
  
    ctx.body = result.map(elem => elem.unnest);
};

const getTop10Movies = async (ctx) => {
    const result = await prisma.movie.findMany({
      take: 10,
      where: {
        tmdbRating: { not: null },
      },  
      orderBy: {
        tmdbRating: 'desc',
      },
    });
  
    ctx.body = result;
};

const getMovieDetails = async (ctx) => {
    const movie = await prisma.movie.findUnique({
      where: {
        tmdbId: Number(ctx.params.id),
      },
    })
  
    ctx.body = movie;
};

const getMoviesList = async (ctx) => {
    const { request: { query } } = ctx;
  
    const take = query.count <= 50 ? +query.count : 50
  
    const queryArgs = {
      where: {},
    };
  
    if (query.genre) {
      queryArgs.where.genres = {
        has: query.genre,
      };
    }
  
    if (query.title) {
      queryArgs.where.title = {
        contains: query.title,
        mode: 'insensitive',
      };
    }
  
    const movies = await prisma.movie.findMany({
      take,
      skip: (query.page * take) || 0,
      ...queryArgs,
    });
  
    ctx.body = movies;
};

module.exports = {
    getRandomMovie,
    getGenres,
    getTop10Movies,
    getMovieDetails,
    getMoviesList,
}