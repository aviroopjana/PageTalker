import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Poppins } from "next/font/google";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

const font = Poppins({ weight: "600", subsets: ["latin"] });

const Navbar = () => {
    return (
        <nav className="sticky h-14 top-0 z-30 inset-x-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg " >
            <MaxWidthWrapper>
                <div className="h-14 flex border-b items-center justify-between border-zinc-200">
                    <Link 
                        href="/" 
                        className={cn("hidden md:flex z-40 text-3xl font-bold text-primary",font.className)}
                    >
                        <span>Page<span className="text-blue-600">Talker</span></span>
                    </Link>

                    {/* TODO: Add mobile navbar */}

                    <div className="hidden md:items-center space-x-4 sm:flex">
                        <Link
                            href="/pricing"
                            className={buttonVariants({
                                variant: "ghost",
                                size: "sm"
                            })}
                        >
                            Pricing
                        </Link>
                        
                        <Link
                            href="/sign-in"
                            className={buttonVariants({
                                variant: "ghost",
                                size: "sm"
                            })}
                        >
                            Sign In
                        </Link>

                        <Link
                            href="/sign-up"
                            className={buttonVariants({
                                size: "sm"
                            })}
                        >
                            Get Started <ArrowRight className="ml-1.5 h-5 w-5"/>
                        </Link>                        
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar;