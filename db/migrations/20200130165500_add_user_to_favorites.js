
exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('favorites', function (table) {
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users');
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('favorites', table => {
      table.dropColumn('user_id');
    })
  ])
};
