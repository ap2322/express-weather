var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

var googleGeo = require('../../../lib/services/googleGeoService');

router.get('/', (request, response, next) => {
  // -1. Make sure api key sent in request
  const user = request.body;

  for (let requiredParameter of ['api_key']) {
    if (!user[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { api_key: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  // 0. Check api_key in body to make sure it's in db
  database('users')
    .where('api_key', user['api_key'])
    .select()
    .then(users => {
      if(users.length === 0) {
        // no matching api_key in db
        return response
        .status(404)
        .send({error: "Unauthorized Request"});
      } else {
        // authorized request made!
        let foundUser = users[0];
        // let info = googleGeo.getGoogleData(request.query);
        let info = googleGeo.fetchAsync();
        // info.then(data => console.log("it worked!"))
        // console.log(typeof foundUser);
        response
        .status(200)
        .send({success: "Authorized Request", user: foundUser, info: info})
      }
    })
    .catch(error => {
      response.status(500).json({error})
    })

  // 1. get parameters from request
  let searchLocation = request.query
  // 2. Send parameters to geocode serivce to get lat and long
  // 3. Send lat and long to darksky service to get forecast
  // 4. format forecast into expected json format
  // 5. return the response.json(forecast)

  // database('papers').select()
  //   .then((papers) => {
  //     response.status(200).json(papers);
  //   })
  //   .catch((error) => {
  //     response.status(500).json({ error });
  //   });
});

module.exports = router;
