import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-6xl font-bold mb-4">MediVerse</h1>
      <p className="text-xl mb-8">Revolutionizing Pre-Surgical Care</p>
      <Link
        href="/pre-op"
        className="px-6 py-3 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-md hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-purple-500/30 backdrop-blur-sm border border-purple-400/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        Enter Pre-Op
      </Link>
    </div>
  );
}
