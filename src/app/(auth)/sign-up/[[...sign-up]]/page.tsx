import { SignUp} from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-between">
            <p className="text-center text-2xl font-semibold text-muted-foreground text-black">
                Demo Accounts
            </p>
            <p className="text-center mt-2 font-normal text-muted-foreground">
                Email: xyz@gmail.com &nbsp;&nbsp;&nbsp; Password: afhasdbfghjab
                <br />
                Email: pqr@gmail.com &nbsp;&nbsp;&nbsp; Password: ggadghdhdhd
            </p>
            <p className="text-center mt-3 font-semibold text-muted-foreground">
                *If you do not wish to SignUp right now, you may proceed with this demo accounts!* <br /> (Demo accounts are for demonstration purposes only)
            </p>
            <div className="mt-4">
                <SignUp/>
            </div>         
        </div>
    )
}