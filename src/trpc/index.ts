import { auth, clerkClient } from "@clerk/nextjs";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { userId } = auth();

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const user = await clerkClient.users.getUser(userId);

    //check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      //Create user in database
      await db.user.create({
        data: {
          id: user.id,
          username: user.username,
          name: user.firstName,
        },
      });
    }

    return { success: true };
  }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const userObject = await db.user.findUnique({ where: { id: user.id } });

    const results = await db.file.findMany({
      where: {
        User: userObject,
      },
    });
    return results;
  }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      const userObject = await db.user.findUnique({ where: { id: user.id } });

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          User: userObject 
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return file;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
