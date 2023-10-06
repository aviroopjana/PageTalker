import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { UserButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async() => {
    const user = await currentUser();

    if(!user || !user.id) redirect("/auth-callback?origin=dashboard")

    return(
        <div>
            <MaxWidthWrapper className="flex flex-row">
                <div className="flex justify-start">
                    {user.firstName} {user.lastName}
                </div>
                <div className="items-end justify-end">
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </MaxWidthWrapper>
        </div>
    )
}

export default Page;