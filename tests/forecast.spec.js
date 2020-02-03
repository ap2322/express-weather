var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);


describe('Test the city forecast path', () => {
  beforeEach(async () => {
    await database.raw('truncate table users cascade');

    let user = {
      email: 'tester@test.com',
      api_key: 'anything-you-like'
    };
    await database('users').insert(user, 'id');
  });

  afterEach(() => {
    database.raw('truncate table users cascade');
  });

  describe('test forecast GET', () => {
    it('happy path', async () => {

      const res = await request(app)
        .get("/api/v1/forecast?location=denver,co")
        .send({"api_key": "anything-you-like"})


      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty('location');
      expect(res.body).toHaveProperty('currently');
      expect(res.body).toHaveProperty('hourly');
      expect(res.body).toHaveProperty('daily');
    });

    it('sad path', async () => {
      const res = await request(app)
        .get("/api/v1/forecast")
        .send({"api_key": "anything-you-like"})

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('error');
    });

    it('sad path, no api_key', async () => {
      const res = await request(app)
        .get("/api/v1/forecast?location=denver,co")

      expect(res.statusCode).toBe(422);
      expect(res.body.error).toBe("Expected format: { api_key: <String> }. You're missing a \"api_key\" property.")
    });
  });
});
