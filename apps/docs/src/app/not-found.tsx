import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#141414] text-[#e2e2e2] font-mono gap-4">
            <h1 className="text-3xl font-bold text-[#fb923c]">404</h1>
            <p className="text-sm text-[#8c8c8c]">page not found</p>
            <Link
                href="/"
                className="mt-2 text-xs text-[#fb923c] underline underline-offset-4 hover:text-white"
            >
                return home
            </Link>
        </div>
    )
}
