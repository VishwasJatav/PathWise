import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
      {/* Animated 404 */}
      <h1 className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
        404
      </h1>

      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-2">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-gray-600 max-w-md mb-8">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Action */}
      <Link href="/" passHref>
        <Button className="rounded-xl px-6 py-2 text-lg shadow-lg hover:scale-105 transition-transform duration-200">
          Go Back Home
        </Button>
      </Link>
    </div>
  );
}
