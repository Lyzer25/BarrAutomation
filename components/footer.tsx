import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container mx-auto px-4 text-center text-subtle-gray">
        <div className="flex justify-center items-center mb-4">
          <Image src="/barr-logo.png" alt="Barr Automations" width={100} height={26} className="h-6 w-auto" />
        </div>
        <p className="text-sm">Building custom, intelligent automations for modern businesses.</p>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <Link href="/" className="hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/demos" className="hover:text-accent transition-colors">
            Demos
          </Link>
          <Link href="/contact" className="hover:text-accent transition-colors">
            Contact
          </Link>
        </div>
        <p className="text-xs mt-6">&copy; {new Date().getFullYear()} Barr Automations. All rights reserved.</p>
      </div>
    </footer>
  )
}
