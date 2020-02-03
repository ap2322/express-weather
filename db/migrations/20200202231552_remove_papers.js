
exports.up = function(knex) {
  return Promise.all([
    knex.schema.dropTable('papers')
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.createTable('papers', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('author');
      table.string('publisher');

      table.timestamps(true, true);
    })
  ])
};
