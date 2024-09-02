exports.up = function(knex) {
    return knex.schema.dropTableIfExists('comments')
      .then(function() {
        return knex.schema.createTable('comments', function(table) {
          table.increments('id').primary();
          table.integer('discussion_id').unsigned().references('id').inTable('discussions').onDelete('CASCADE'); // Reference to discussions table
          table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE'); // Reference to users table
          table.text('content').notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
      });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('comments');
  };