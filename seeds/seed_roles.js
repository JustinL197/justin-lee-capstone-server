exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      return knex('roles').insert([
        { id: 1, name: 'Faculty Member' },
        { id: 2, name: 'Student' }
      ]);
    });
};