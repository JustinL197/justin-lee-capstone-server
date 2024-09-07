exports.up = function(knex) {
    return knex.schema.table('discussions', function(table) {
      table.dropColumn('topic');
      table.dropColumn('subject');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('discussions', function(table) {
      table.string('topic').notNullable();
      table.string('subject').notNullable();
    });
  };