import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Generate a short-lived URL for file uploads
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// ✅ Fetch all user accounts
export const getAccounts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("accounts").collect();
  },
});


// ✅ Save uploaded document storage ID in the database
export const saveDocument = mutation({
    args: {
      accountId: v.id("accounts"), // The user's account ID
      documentType: v.union(
        v.literal("aadhaar"),
        v.literal("pan"),
        v.literal("income"),
        v.literal("selfie")
      ), // Define allowed document types
      fileId: v.id("_storage"), // Convex storage ID
    },
    handler: async (ctx, { accountId, documentType, fileId }) => {
      const account = await ctx.db.get(accountId);
      if (!account) {
        throw new Error("Account not found");
      }
  
      await ctx.db.patch(accountId, {
        documents: {
          ...account.documents,
          [documentType]: fileId, // Dynamically update the correct document field
        },
      });
    },
  });

// ✅ Create a new account (fixing document storage ID issue)
export const createAccount = mutation({
    args: {
      personalDetails: v.object({
        uid: v.string(),
        name: v.string(),
        dob: v.string(),
        gender: v.string(),
        aadhaar_number: v.string(),
        pan_number: v.string(),
        income: v.optional(v.string()),
        employment: v.optional(v.string()),
      }),
      documents: v.optional(
        v.object({
          aadhaar: v.optional(v.id("_storage")),
          pan: v.optional(v.id("_storage")),
          income: v.optional(v.id("_storage")),
          selfie: v.optional(v.id("_storage")),
        })
      ),
      account: v.object({
        type: v.optional(v.literal("savings")),
        depositAmount: v.number(),
        accountId: v.string()
      }),
    },
    handler: async (ctx, args) => {
      const id = await ctx.db.insert("accounts", {
        personalDetails: args.personalDetails,
        account: args.account,
        documents: args.documents ?? {}, // ✅ Ensures documents is always an object
        createdAt: Date.now(),
      });
  
      return id;
    },
  });
  
