/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("product_variants", t => {
    t.increments("id");
    t.string("name").notNullable();
    t.integer("stock").notNullable();
    t.string("product_id").notNullable();
    t.foreign("product_id").references("id").inTable("products").onDelete("CASCADE");
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("product_variants");
};
