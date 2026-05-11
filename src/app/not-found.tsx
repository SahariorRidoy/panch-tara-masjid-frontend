import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <div className="text-8xl font-bold text-[#1a7a4a] mb-4">404</div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="bg-[#1a7a4a] text-white px-6 py-2.5 rounded-lg hover:bg-[#155f3a] transition-colors font-medium">
        Go Home
      </Link>
    </div>
  );
}
