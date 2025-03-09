import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.text("description");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("cart", (table) => {
    table.increments("id").primary();
    table
      .integer("product_id")
      .unsigned()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.integer("quantity").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("users", (table) => {
    table.string("username").primary();
    table.string("password").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("cart");
  await knex.schema.dropTableIfExists("products");
  await knex.schema.dropTableIfExists("users");
}
