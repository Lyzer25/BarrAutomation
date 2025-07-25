import Link from "next/link"
import { Bot } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container mx-auto px-4 text-center text-subtle-gray">
        <div className="flex justify-center items-center mb-4">
          <Bot className="h-6 w-6 text-accent mr-2" />
          <p className="text-lg font-bold font-mono text-white">Barri.ai</p>
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
        <p className="text-xs mt-6">&copy; {new Date().getFullYear()} Barri.ai. All rights reserved.</p>
      </div>
    </footer>
  )
}
