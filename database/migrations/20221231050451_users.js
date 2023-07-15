/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("users", t => {
    t.string("id").primary();
    t.string("store_id");
    t.foreign("store_id").references("id").inTable("stores").onDelete("SET NULL");
    t.string("email").unique().notNullable();
    t.string("password").notNullable();
    t.string("name").notNullable();
    t.integer("otp", 6);
    t.string("avatar");
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
