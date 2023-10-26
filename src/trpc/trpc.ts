import { TRPCError, initTRPC } from "@trpc/server";
import { auth, clerkClient } from "@clerk/nextjs";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const { userId } = auth();
  // check if user is authenticated
  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await clerkClient.users.getUser(userId);

  return opts.next({
    ctx: {
      user: user
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
