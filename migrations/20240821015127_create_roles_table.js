exports.up = function(knex) {
  return knex.schema.hasTable('roles').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('roles', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('roles');
};