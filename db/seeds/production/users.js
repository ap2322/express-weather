const { uuid } = require('uuidv4');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      return Promise.all([
        knex('users').insert([
          {email: 'admin1@email.com', api_key: uuid('admin1')},
        ])
        .then(() => console.log("Seeding complete"))
        .catch(error => console.log(`Error seeding data ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data ${error}`));
};
