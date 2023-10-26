import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { UserButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async() => {
    const user = await currentUser();

    //check if user is logged in or not  
    if(!user || !user.id) redirect("/auth-callback?origin=dashboard");

    const dbUser = await db.user.findFirst({
        where: {
            id: user.id,
        },
    })

    //check if user is synced to the database or not 
    if(!dbUser) {
        redirect("/auth-callback?origin=dashboard");
    }

    return(
        <Dashboard/>
    )
}

export default Page;