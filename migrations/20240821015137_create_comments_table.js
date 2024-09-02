exports.up = function(knex) {
  return knex.schema.hasTable('comments').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('comments', function(table) {
        table.increments('id').primary();
        table.integer('post_id').unsigned().references('id').inTable('announcements').onDelete('CASCADE');
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.text('content').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comments');
};