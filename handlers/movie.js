const mapMovieModel = require('../libs/mapMovieModel');
const prisma = require('../prisma');

const getRandomMovie = async (ctx) => {
  try {
    const count = await prisma.movie.count();
    const skip = Math.floor(Math.random() * count);
    const movie = await prisma.movie.findMany({
        take: 1,
        skip: skip,
    });

    ctx.body = movie.map(mapMovieModel)[0];
  } catch(e) {
    ctx.body = e;
  }
};

const getGenres = async (ctx) => {
  try {
    const result = await prisma.$queryRaw`SELECT distinct unnest(genres) FROM "Movie"`
  
    ctx.body = result.map(elem => elem.unnest);
  } catch(e) {
    ctx.body = e;
  }
};

const getTop10Movies = async (ctx) => {
  try {
    const result = await prisma.movie.findMany({
      take: 10,
      where: {
        tmdbRating: { not: null },
      },  
      orderBy: {
        tmdbRating: 'desc',
      },
    });
  
    ctx.body = result.map(mapMovieModel);
  } catch(e) {
    ctx.body = e;
  }
};

const getMovieDetails = async (ctx) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: {
        tmdbId: Number(ctx.params.id),
      },
    })
  
    ctx.body = [movie].map(mapMovieModel)[0];
  } catch(e) {
    ctx.body = e;
  }
};

const getMoviesList = async (ctx) => {
  try {
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
  
    ctx.body = movies.map(mapMovieModel);
  } catch (e) {
    ctx.body = e;
  }
};

module.exports = {
    getRandomMovie,
    getGenres,
    getTop10Movies,
    getMovieDetails,
    getMoviesList,
}