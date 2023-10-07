import { useUser } from '@clerk/nextjs';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
  // test: publicProcedure.query(()=> {
  //   return new Response()
  // })
  authCallback: publicProcedure.query(()=> {
    const { user } = useUser();

    if(!user?.id || !user?.username) throw new TRPCError({"code": "UNAUTHORIZED"})

    //check if the user is in database
    
    return {success: true};
  })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;