/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("storefronts", t => {
    t.increments("id");
    t.string("name").notNullable();
    t.string("store_id").notNullable();
    t.foreign("store_id").references("id").inTable("stores").onDelete("CASCADE");
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("storefronts");
};
