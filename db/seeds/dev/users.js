const { uuid } = require('uuidv4');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      return Promise.all([
        knex('users').insert([
          {email: 'tester1@email.com', api_key: uuid('test1')},
          {email: 'tester2@email.com', api_key: uuid('test2')},
          {email: 'tester3@email.com', api_key: uuid('test3')}
        ])
        .then(() => console.log("Seeding complete"))
        .catch(error => console.log(`Error seeding data ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data ${error}`));
};
