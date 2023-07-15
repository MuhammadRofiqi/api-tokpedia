/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("carts", t => {
    t.string("id").primary();
    t.string("user_id").notNullable();
    t.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    t.string("product_id").notNullable();
    t.foreign("product_id").references("id").inTable("products").onDelete("CASCADE");
    t.integer("qty").unsigned();
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("carts");
};
