exports.up = function(knex) {
  return knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('SET NULL');
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('username').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};