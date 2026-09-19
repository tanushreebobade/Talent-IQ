import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      if (!user) {
        console.log(`User not found in DB for clerkId ${clerkId}, fetching from Clerk API...`);
        const clerkUser = await clerkClient.users.getUser(clerkId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
        const profileImage = clerkUser.imageUrl;

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
      }

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
