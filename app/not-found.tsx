import Link from "next/link";

const NotFound = () => {
    return (
        <section className="flex w-full h-screen flex-col items-center justify-center gap-4">
           <h1 className="text-5xl"><span className="text-rose-500">404</span> Not Found</h1>
           <p>You got lost, no worries</p>
           <Link href="/" className="border-2 border-black p-4 bg-amber-50 text-black hover:cursor-pointer hover:bg-white">Go back to home</Link>
        </section>
    )
};

export default NotFound;