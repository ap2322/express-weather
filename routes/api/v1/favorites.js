var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);


router.get('/', (request, response) => {
  // database('papers').select()
  //   .then((papers) => {
      response.status(200).send('favorites');
    // })
    // .catch((error) => {
    //   response.status(500).json({ error });
    // });
});

module.exports = router;
