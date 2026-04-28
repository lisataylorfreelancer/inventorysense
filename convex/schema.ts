import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const applicationTables = {
  profiles: defineTable({
    userId: v.id("users"),
    niche: v.string(),
    keywords: v.array(v.string()),
    isPremium: v.boolean(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
  alerts: defineTable({
    userId: v.id("users"),
    productName: v.string(),
    confidenceScore: v.number(), // 0 to 100
    reason: v.string(),
    status: v.union(v.literal("active"), v.literal("dismissed")),
    createdAt: v.number(),
  }).index("by_userId_createdAt", ["userId", "createdAt"]),
  trendReports: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    niche: v.string(),
    createdAt: v.number(),
  }).index("by_userId_createdAt", ["userId", "createdAt"]),
  files: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    description: v.optional(v.string()),
    uploadedAt: v.number(),
  })
    .index("by_userId_uploadedAt", ["userId", "uploadedAt"])
    .index("by_userId_storageId", ["userId", "storageId"]),
  chatThreads: defineTable({
    userId: v.id("users"),
    title: v.string(),
    systemPrompt: v.string(),
    model: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_updatedAt", ["userId", "updatedAt"]),
  chatMessages: defineTable({
    threadId: v.id("chatThreads"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_threadId", ["threadId"])
    .index("by_threadId_createdAt", ["threadId", "createdAt"]),
};
export default defineSchema({
  ...authTables,
  ...applicationTables,
});