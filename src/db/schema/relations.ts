import { relations } from "drizzle-orm";
import { user, session, account, posts } from "./schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  posts: many(posts),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(user, {
    fields: [posts.userId],
    references: [user.id],
  }),
}));
