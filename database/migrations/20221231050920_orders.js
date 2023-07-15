/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("orders", t => {
    t.string("id").primary();
    t.string("buyer_id").notNullable();
    t.foreign("buyer_id").references("id").inTable("users").onDelete("CASCADE");
    t.integer("delivery_service_id").unsigned().notNullable();
    t.foreign("delivery_service_id").references("id").inTable("delivery_services").onDelete("RESTRICT");
    t.enum("status", ["menunggu", "diproses", "dibatalkan", "diterima"]);
    t.integer("total").unsigned();
    t.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("orders")
};
