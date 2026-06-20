import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            P
          </span>
          <span className="text-lg font-semibold text-slate-900">PrepWise AI</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className="text-slate-600 transition hover:text-indigo-600"
          >
            Create Plan
          </Link>
          <Link
            href="/plans"
            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-indigo-700 transition hover:bg-indigo-100"
          >
            My Plans
          </Link>
        </nav>
      </div>
    </header>
  );
}
