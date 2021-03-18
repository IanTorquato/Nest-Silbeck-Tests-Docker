const port = Number(process.env.TYPEORM_PORT);
// const portRedis = Number(process.env.REDIS_PORT);

module.exports = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port,
  // Não funcionou typeorm + redis
  // cache: {
  //   type: 'redis',
  //   options: {
  //     host: process.env.REDIS_HOST,
  //     port: portRedis,
  //     prefix: 'user:',
  //   },
  // },
};
