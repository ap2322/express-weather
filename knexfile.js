// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/express_weather_dev',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/express_weather_test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: 'postgres://ruzktsqenjtmky:ef856d2dcab765c950d42ea2eceab0b236e7e8aa6fe2531abbff35db8dff6f16@ec2-52-71-122-102.compute-1.amazonaws.com:5432/ddtuin9544apsj',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
