const Redis = require('ioredis');
const redis = new Redis('redis://redis');

exports.getGame = async (id) => {
  const res = await redis.get(id);
  const data = JSON.parse(res);

  if (!data) return null;
  else return data;
};

exports.setGame = async (id, gameData) => {
  const res = await redis.setex(id, process.env.GAME_EXPIRY, JSON.stringify(gameData));

  if (res) return res;
};

exports.del = async (id) => {
  await redis.del(id);
};

exports.getAll = async () => {
  const allGames = [];
  const games = await redis.keys('*');

  if (games.length != 0) {
    const res = await redis.mget(games);

    res.forEach((game) => {
      allGames.push(JSON.parse(game));
    });
  }
  return allGames;
};
