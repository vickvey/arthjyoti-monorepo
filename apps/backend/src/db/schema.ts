import { relations } from "drizzle-orm";
import { generateUUID } from "@/utils/generate-uuid";
import {
  real,
  sqliteTable,
  text,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

// Table: users
export const users = sqliteTable(
  "users",
  {
    id: text()
      .$defaultFn(() => generateUUID())
      .primaryKey(),
    email: text().unique().notNull(),
    password: text().notNull(),
    role: text({ enum: ["standard", "admin"] })
      .default("standard")
      .notNull(),
    createdAt: text({ length: new Date().toISOString().length }).$defaultFn(
      () => new Date().toISOString()
    ),
    updatedAt: text({ length: new Date().toISOString().length }).$defaultFn(
      () => new Date().toISOString()
    ),
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)]
);

// Table: refresh_tokens
export const refreshTokens = sqliteTable("refresh_tokens", {
  id: text()
    .$defaultFn(() => generateUUID())
    .primaryKey(),
  token: text().unique().notNull(),
  expiresAt: text({ length: new Date().toISOString().length }).notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: text({ length: new Date().toISOString().length }).$defaultFn(() =>
    new Date().toISOString()
  ),
  updatedAt: text({ length: new Date().toISOString().length }).$defaultFn(() =>
    new Date().toISOString()
  ),
});

// Enum: categories color
export const categoriesColorEnum = [
  "white",
  "red",
  "green",
  "yellow",
  "blue",
  "violet",
  "purple",
];

// Table: categories
export const categories = sqliteTable(
  "categories",
  {
    id: text()
      .$defaultFn(() => generateUUID())
      .primaryKey(),
    name: text().notNull(),
    description: text().notNull(),
    color: text({
      enum: ["red", "green", "yellow", "blue", "violet", "white"],
    }).default("white"),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    createdAt: text({ length: new Date().toISOString().length }).$defaultFn(
      () => new Date().toISOString()
    ),
    updatedAt: text({ length: new Date().toISOString().length }).$defaultFn(
      () => new Date().toISOString()
    ),
  },
  (table) => [
    uniqueIndex("categories_name_user_id_unique").on(table.name, table.userId), // Optional: prevent duplicate category names per user
    index("categories_user_id_idx").on(table.userId), // For filtering user's categories
  ]
);

// Table: transactions
export const transactions = sqliteTable(
  "transactions",
  {
    id: text()
      .$defaultFn(() => generateUUID())
      .primaryKey(),
    amount: real().notNull(),
    type: text({ enum: ["income", "savings", "expenditure"] }).default(
      "expenditure"
    ),
    description: text().notNull(),
    currency: text({ enum: ["INR", "USD", "EUR"] }),
    date: text({ length: new Date().toISOString().length }),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    categoryId: text("category_id")
      .references(() => categories.id)
      .notNull(),
    createdAt: text({ length: new Date().toISOString().length }).$defaultFn(
      () => new Date().toISOString()
    ),
    updatedAt: text({ length: new Date().toISOString().length }).$defaultFn(
      () => new Date().toISOString()
    ),
  },
  (table) => [
    index("transactions_user_id_idx").on(table.userId),
    index("transactions_category_id_idx").on(table.categoryId),
    index("transactions_date_idx").on(table.date), // If you filter or order by date
    index("transactions_user_category_idx").on(table.userId, table.categoryId), // 👈 Composite index
  ]
);

// Relation
export const usersRelations = relations(users, ({ one, many }) => ({
  tokens: one(refreshTokens),
  categories: many(categories),
  transactions: many(transactions),
}));

// Relation
export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

// Relation
export const categoryRelations = relations(categories, ({ one }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
}));

// Relation
export const transactionRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));
