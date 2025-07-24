import Link from "next/link";

const NotFound = () => {
    return (
        <section>
           <h1>404 Not Found</h1>
           <Link href="/">Go back to home</Link>
        </section>
    )
};

export default NotFound;