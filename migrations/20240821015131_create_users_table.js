exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('username').unique().notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };