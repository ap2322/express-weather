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
      database('favorites').insert({location: info['location'],
                                    user_id: user.id}, 'id')
      .then(async(favorite) => {
        addLatLong(favorite)
          .then(data => {
            response.send(data);
          })
      })
    })


    // Returns [ { id: 42, title: "The Hitchhiker's Guide to the Galaxy" } ]

  // 5. .catch error handling

});

// 4. look up lat and long of favorite to add update row in table
async function addLatLong(fav) {
  let fav_id = fav[0]
  let updated = await database('favorites')
    .where({id: fav_id})
    .update({latitude: 4322.22, longitude: 3333.33}, ['id', 'latitude', 'longitude'])

  console.log(updated);
  return updated;
}

// console.log(favorite, favorite[0]);
// database('favorites')
//   .where({ id: favorite[0] })
//   .update({ latitude: 100.00}, ['id', 'latitude'])
// })
// .then(info => {
// response.send(info)
// })

module.exports = router;
