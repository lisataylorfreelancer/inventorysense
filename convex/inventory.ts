import { query, mutation, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});
export const saveProfile = mutation({
  args: {
    niche: v.string(),
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        niche: args.niche,
        keywords: args.keywords,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("profiles", {
        userId,
        niche: args.niche,
        keywords: args.keywords,
        isPremium: false,
        updatedAt: Date.now(),
      });
    }
  },
});
export const listAlerts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("alerts")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
export const listReports = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("trendReports")
      .withIndex("by_userId_createdAt", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
export const generateMockAlerts = mutation({
  args: { niche: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const mockData = [
      { productName: `Viral ${args.niche} Accessory`, confidenceScore: 88, reason: "Sudden 300% spike in TikTok mentions over last 48h." },
      { productName: `Eco-friendly ${args.niche} Kit`, confidenceScore: 74, reason: "Search volume increasing on Etsy for handmade variants." },
      { productName: `Retro ${args.niche} Aesthetic`, confidenceScore: 92, reason: "High engagement on Instagram reels using specific niche hashtags." },
    ];
    for (const item of mockData) {
      await ctx.db.insert("alerts", {
        userId,
        productName: item.productName,
        confidenceScore: item.confidenceScore,
        reason: item.reason,
        status: "active",
        createdAt: Date.now(),
      });
    }
  },
});
export const saveTrendReportInternal = internalMutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    niche: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("trendReports", {
      userId: args.userId,
      title: args.title,
      content: args.content,
      niche: args.niche,
      createdAt: Date.now(),
    });
  },
});
export const generateTrendReport = action({
  args: { niche: v.string(), keyword: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const apiKey = process.env.ANDROMO_AI_API_KEY;
    if (!apiKey) throw new Error("AI integration missing");
    const prompt = `Act as an expert e-commerce trend analyst. Provide a deep-dive trend report for the niche: "${args.niche}" ${args.keyword ? `specifically focusing on "${args.keyword}"` : ""}. 
    Include:
    1. Market Sentiment Analysis
    2. Rising Keywords & Hashtags
    3. Sourcing Recommendations
    4. Predicted Demand for next 30 days.
    Keep the tone professional and data-driven. Use plain text formatting with clear sections.`;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "X-Title": "InventorySense Analyst",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });
    if (!response.ok) throw new Error(`AI API Error: ${response.status}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Analysis unavailable.";
    await ctx.runMutation(internal.inventory.saveTrendReportInternal, {
      userId,
      title: `${args.niche} - ${new Date().toLocaleDateString()} Analysis`,
      content,
      niche: args.niche,
    });
    return content;
  },
});