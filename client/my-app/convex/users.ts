import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";


export const createUser = mutation({
  args: {
    uid: v.string(),
    name: v.string(),
    email: v.string(),
    password: v.string(),
    customerID: v.string(),
    age: v.number(),
    income: v.number(),
    accounts: v.number(),
    loans: v.number()
  },
  handler: async ({ db }, { uid, name, email, password, customerID, age, income, accounts, loans }) => {
    // Store hashed passwords in a real-world scenario
    const userId = await db.insert("users", {
      uid,
      name,
      email,
      password,
      customerID,
      income,
      age,
      accounts,
      loans,
      createdAt: Date.now(),
    });

    return userId;
  },
});

export const incrementAccountCount = mutation({
  args: { uid: v.string() },
  handler: async ({ db }, { uid }) => {
    const user = await db.query("users").filter((q) => q.eq(q.field("uid"), uid)).first();
    
    if (!user) throw new Error("User not found");

    // Increment account count
    await db.patch(user._id, { accounts: (user.accounts ?? 0) + 1 });
  },
});
export const incrementLoanCount = mutation({
  args: { uid: v.string() },
  handler: async ({ db }, { uid }) => {
    const user = await db.query("users").filter((q) => q.eq(q.field("uid"), uid)).first();
    
    if (!user) throw new Error("User not found");

    // Increment account count
    await db.patch(user._id, { loans: (user.loans ?? 0) + 1 });
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
        .filter((q) => q.eq(q.field("uid"), uid))
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
