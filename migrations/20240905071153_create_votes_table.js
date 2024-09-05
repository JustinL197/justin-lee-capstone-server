exports.up = function(knex) {
    return knex.schema.createTable('votes', (table) => {
      table.increments('id').primary(); // Primary key, auto-increments
      table.integer('user_id').unsigned().notNullable(); // User ID, must be unsigned (non-negative)
      table.integer('announcement_id').unsigned().notNullable(); // Announcement ID, must be unsigned
      table.enu('vote_type', ['upvote', 'downvote']).notNullable(); // Vote type, either upvote or downvote
      table.unique(['user_id', 'announcement_id']); // Unique constraint to ensure a user votes once per announcement
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE'); // Foreign key to users table
      table.foreign('announcement_id').references('id').inTable('announcements').onDelete('CASCADE'); // Foreign key to announcements table
      table.timestamps(true, true); // Adds created_at and updated_at timestamps
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('votes'); // Rollback, drops the table if it exists
  };