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
    it.skip('happy path', async () => {

      var request = require('request');
      request('/api/v1/forecast?location=denver,co', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
      });

      const res = await request(app)
        .get("/api/v1/forecast?location=denver,co");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);

      expect(res.body[0]).toHaveProperty('title');
      expect(res.body[0].title).toBe('Alternate Endings for Game of Thrones, Season 8');

      expect(res.body[0]).toHaveProperty('author');
      expect(res.body[0].author).toBe('Literally Anyone');

      expect(res.body[0]).toHaveProperty('publisher');
      expect(res.body[0].publisher).toBe('Not George R. R. Martin');
    });
  });
});