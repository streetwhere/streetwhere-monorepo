import { relations } from "drizzle-orm";
import {
	integer,
	pgTableCreator,
	serial,
	text,
	timestamp,
	varchar,
	smallint,
} from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `streetwhere_${name}`);

export const mails = pgTable("mails", {
	id: serial("id").primaryKey(),
	to: varchar("to", { length: 64 }).notNull(),
	subject: varchar("subject").notNull(),
	plain: text("plain"),
	html: text("html"),
	timestamp: timestamp("timestamp").defaultNow(),
});

export const mailsRelations = relations(mails, ({ one, many }) => ({
	shop: one(shops, {
		fields: [mails.to],
		references: [shops.to],
	}),
	asset: many(assets),
}));

export const shops = pgTable("shops", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 32 }).notNull(),
	url: varchar("url", { length: 64 }).notNull().unique(),
	to: varchar("to", { length: 64 }).notNull().unique(),
});

export const shopsRelations = relations(shops, ({ many }) => ({
	mails: many(mails),
}));

export const assets = pgTable("assets", {
	id: serial("id").primaryKey(),
	mailId: integer("mail_id")
		.references(() => mails.id)
		.notNull(),
	path: varchar("path", { length: 128 }).unique().notNull(),
	width: smallint("width"),
	height: smallint("height"),
	contentType: varchar("content_type", { length: 64 }).notNull(),
	size: integer("size").notNull(),
});

export const assetsRelations = relations(assets, ({ one }) => ({
	mail: one(mails, {
		fields: [assets.mailId],
		references: [mails.id],
	}),
}));
