import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-black py-12 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <div className="flex items-center">
                        <img src="/logo.jpg" alt="100 Miles of Summer" className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                    </div>

                    <nav className="flex space-x-12">
                        <Link href="#" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                            About
                        </Link>
                        <Link href="#" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                            Contact
                        </Link>
                    </nav>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                        © 2026 100 MILES OF SUMMER. NO LOST PROGRESS.
                    </p>
                </div>
            </div>
        </footer>
    )
}
