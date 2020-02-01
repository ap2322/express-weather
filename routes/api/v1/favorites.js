var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.post('/', (request, response) => {
  // 1. check request body comes with location and api_key

  const info = request.body;
  console.log(info);

  for (let requiredParameter of ['location', 'api_key']) {
    if (!info[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { location: <String>, api_key: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  // 2. check api_key in users and return user
  database('users')
    .where('api_key', info['api_key'])
    .select()
    .first()
    .then(user => {
      if(user) {
        return user
      } else {
        return response
          .status(401)
          .json({"message": "Unauthorized request"})
      }
    })
    .then(user => {
      // 3. add favorite with user reference
      database('favorites').insert({location: info['location'], user_id: user.id}, 'id')
      .then(favorite => {
        response.json(favorite)
      })
    })
  // 4. look up lat and long of favorite to add update row in table
  // 5. .catch error handling

  // // find paper_id in papers db and return error if not found
  // database('papers')
  //   .where('id', footnote['paper_id'])
  //   .select()
  //   .then(papers => {
  //     if(papers.length === 0) {
  //       return response
  //       .status(404)
  //       .send({ error: `Could not find paper with id ${footnote['paper_id']}` });
  //     } else {
  //       // if paper is found in db, insert footnote into footnotes db
  //       database('footnotes').insert(footnote, 'id')
  //       .then(footnote => {
  //         response.status(201).json({id: footnote[0]});
  //       })
  //       .catch(error => {
  //         response.status(500).json({ error });
  //       });
  //     }
  //   })
});

module.exports = router;
