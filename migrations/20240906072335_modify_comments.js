exports.up = function(knex) {
    return knex.schema.table('comments', function(table) {
      table.integer('likes_count').defaultTo(0);  // Add a likes count field
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('comments', function(table) {
      table.dropColumn('likes_count');
    });
  };