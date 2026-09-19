import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  async (req, res, next) => {
    try {
      const { userId: clerkId } = getAuth(req);

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      if (!user) {
        console.log(`User not found in DB for clerkId ${clerkId}, syncing user from Clerk API...`);
        try {
          const clerkUser = await clerkClient.users.getUser(clerkId);
          const email = clerkUser.emailAddresses?.[0]?.emailAddress || `${clerkId}@clerk.user`;
          const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
          const profileImage = clerkUser.imageUrl || "";

          user = await User.create({
            clerkId,
            email,
            name: name || "Anonymous User",
            profileImage,
          });

          await upsertStreamUser({
            id: clerkId,
            name: name || "Anonymous User",
            image: profileImage,
          });
        } catch (createError) {
          // Handle potential race condition if another concurrent request created user
          const isDuplicateKey =
            createError.code === 11000 ||
            createError.name === "MongoServerError" ||
            (typeof createError.message === "string" && createError.message.includes("E11000"));

          if (isDuplicateKey) {
            user = (await User.findOne({ clerkId })) || (await User.findOne({ email }));
          } else {
            throw createError;
          }
        }
      }

      if (!user) {
        return res.status(500).json({ message: "Failed to resolve user account" });
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
