import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  accounts: defineTable({
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
    documents: v.object({
      aadhaar: v.optional(v.id("_storage")), // Aadhaar document (required)
      pan: v.optional(v.id("_storage")), // PAN document (required)
      income: v.optional(v.id("_storage")), // Optional income proof
      selfie: v.optional(v.id("_storage")), // Profile picture (required)
    }),
    account: v.object({
      type: v.optional(v.literal("savings")), // Default to 'savings'
      depositAmount: v.number(), // Initial deposit amount
      accountId: v.string()
    }),
    createdAt: v.optional(v.number()), // Timestamp for account creation
  }),
  users: defineTable({
    uid: v.string(),
    name: v.string(),
    email: v.string(),
    password: v.string(), // Store hashed passwords for security
    customerID: v.optional(v.string()), // customer id is provided 
    income: v.number(), // Reference to accounts table
    age: v.number(),
    accounts: v.number(),
    loans: v.optional(v.number()),
    createdAt: v.optional(v.number()),
  }),
});
