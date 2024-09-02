exports.up = function(knex) {
  return knex.schema.createTable('announcements', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('topic').notNullable();
    table.string('title').notNullable();
    table.text('preview').notNullable();
    table.text('message').notNullable();
    table.integer('vote_count').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('announcements');
};