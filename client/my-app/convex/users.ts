import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";


export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    customerID: v.string(),
    age: v.number(),
    income: v.number(),
  },
  handler: async ({ db }, { name, email, password, customerID, age, income }) => {
    // Store hashed passwords in a real-world scenario
    const userId = await db.insert("users", {
      name,
      email,
      password,
      customerID,
      income,
      age,
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async ({ db }, { email }) => {
    const user = await db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .first();

    return user;
  },
});

export const getUserByUid = query({
    args: { uid: v.string() },
    handler: async ({ db }, { uid }) => {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), uid))
        .first();
  
      return user;
    },
  });
  

export const updateUserIncome = mutation({
  args: { userId: v.id("users") },
  handler: async ({ db }, { userId }) => {
    // Get the latest account for the user
    const latestAccount = await db
      .query("accounts")
      .filter((q) => q.eq(q.field("personalDetails.uid"), userId))
      .order("desc")
      .first();

    if (!latestAccount) {
      throw new Error("No account found for this user");
    }

    // Update user's income reference
    await db.patch(userId, { income: latestAccount._id });

    return latestAccount.personalDetails.income;
  },
});

export const getUserWithIncome = query({
  args: { userId: v.id("users") },
  handler: async ({ db }, { userId }) => {
    const user = await db.get(userId);

    if (!user) throw new Error("User not found");

    // Fetch the most recent income reference
    let income = null;
    if (user.income) {
      const account = await db.get(user.income);
      income = account?.personalDetails?.income || null;
    }

    return { ...user, income };
  },
});
