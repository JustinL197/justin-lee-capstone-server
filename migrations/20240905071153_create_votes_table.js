exports.up = function(knex) {
    return knex.schema.createTable('votes', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('announcement_id').unsigned().notNullable();
      table.enu('vote_type', ['upvote', 'downvote']).notNullable();
      table.unique(['user_id', 'announcement_id']);
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE'); 
      table.foreign('announcement_id').references('id').inTable('announcements').onDelete('CASCADE');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('votes');
  };