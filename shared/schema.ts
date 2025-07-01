import { pgTable, text, serial, integer, boolean, decimal, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rabbits = pgTable("rabbits", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  gender: text("gender").notNull(), // 'male' | 'female'
  birthDate: date("birth_date").notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  color: text("color"),
  status: text("status").notNull().default("active"), // 'active' | 'sold' | 'butchered' | 'deceased'
  isBreeder: boolean("is_breeder").default(false),
  motherId: integer("mother_id"),
  fatherId: integer("father_id"),
  photoUrl: text("photo_url"), // URL to uploaded photo
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const breedingRecords = pgTable("breeding_records", {
  id: serial("id").primaryKey(),
  motherId: integer("mother_id").notNull(),
  fatherId: integer("father_id").notNull(),
  matingDate: date("mating_date").notNull(),
  expectedKindleDate: date("expected_kindle_date").notNull(),
  actualKindleDate: date("actual_kindle_date"),
  nestBoxDate: date("nest_box_date"),
  litterSize: integer("litter_size"),
  kitsAlive: integer("kits_alive"),
  status: text("status").notNull().default("expecting"), // 'expecting' | 'kindled' | 'weaned' | 'failed'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const offspring = pgTable("offspring", {
  id: serial("id").primaryKey(),
  breedingRecordId: integer("breeding_record_id").notNull(),
  gender: text("gender"), // 'male' | 'female' | 'unknown'
  weight: decimal("weight", { precision: 5, scale: 2 }),
  color: text("color"),
  status: text("status").notNull().default("alive"), // 'alive' | 'sold' | 'butchered' | 'deceased' | 'kept'
  salePrice: decimal("sale_price", { precision: 8, scale: 2 }),
  saleDate: date("sale_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'feed' | 'veterinary' | 'equipment' | 'supplies' | 'other'
  subcategory: text("subcategory"),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 8, scale: 2 }).notNull(),
  date: date("date").notNull(),
  vendor: text("vendor"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const butcherRecords = pgTable("butcher_records", {
  id: serial("id").primaryKey(),
  rabbitId: integer("rabbit_id"),
  offspringId: integer("offspring_id"),
  butcherDate: date("butcher_date").notNull(),
  liveWeight: decimal("live_weight", { precision: 5, scale: 2 }),
  dressedWeight: decimal("dressed_weight", { precision: 5, scale: 2 }),
  processingNotes: text("processing_notes"),
  meatDistribution: jsonb("meat_distribution"), // { cuts: string[], weights: number[], recipients: string[] }
  totalValue: decimal("total_value", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertRabbitSchema = createInsertSchema(rabbits).omit({
  id: true,
  createdAt: true,
});

export const insertBreedingRecordSchema = createInsertSchema(breedingRecords).omit({
  id: true,
  createdAt: true,
});

export const insertOffspringSchema = createInsertSchema(offspring).omit({
  id: true,
  createdAt: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
});

export const insertButcherRecordSchema = createInsertSchema(butcherRecords).omit({
  id: true,
  createdAt: true,
});

// Types
export type Rabbit = typeof rabbits.$inferSelect;
export type InsertRabbit = z.infer<typeof insertRabbitSchema>;
export type BreedingRecord = typeof breedingRecords.$inferSelect;
export type InsertBreedingRecord = z.infer<typeof insertBreedingRecordSchema>;
export type Offspring = typeof offspring.$inferSelect;
export type InsertOffspring = z.infer<typeof insertOffspringSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type ButcherRecord = typeof butcherRecords.$inferSelect;
export type InsertButcherRecord = z.infer<typeof insertButcherRecordSchema>;
