exports.up = function(knex) {
    return knex.schema.createTable('likes', (table) => {
      table.increments('id').primary(); // Primary key
      table.integer('user_id').unsigned().notNullable();
      table.integer('comment_id').unsigned().notNullable();
      table.unique(['user_id', 'comment_id']); // Ensure each user can like a comment only once
  
      // Foreign key constraints
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('comment_id').references('id').inTable('comments').onDelete('CASCADE');
  
      // Timestamps
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('likes');
  };