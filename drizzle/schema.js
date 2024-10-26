import { pgTable, serial, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  role: text('role').notNull(), // 'student' or 'teacher'
});

export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});