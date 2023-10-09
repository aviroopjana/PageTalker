import { auth, clerkClient } from '@clerk/nextjs';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';

export const appRouter = router({
  // test: publicProcedure.query(()=> {
  //   return new Response()
  // })
  authCallback: publicProcedure.query(async()=> {
    const { userId } = auth();

    if(!userId) throw new TRPCError({"code": "UNAUTHORIZED"})

    const user = await clerkClient.users.getUser(userId);

    //check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      },
    })

    if(!dbUser) {
      //Create user in database
      await db.user.create({
        data: {
          id: user.id,
          username: user.username,
          name: user.firstName,
        }
      })
    }

    return {success: true};
  })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;