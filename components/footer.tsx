import Link from "next/link"
import Image from "next/image"
import { MapPin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        {/* Top section with logo and tagline */}
        <div className="flex justify-center items-center mb-6">
          <Image
            src="/barrautomationslogo.png"
            alt="Barr Automations Logo"
            width={32}
            height={32}
            className="h-8 w-8 mr-2"
          />
          <p className="text-lg font-bold font-mono text-white">Barr Automations</p>
        </div>

        <p className="text-sm text-center text-subtle-gray mb-8">
          Building custom, intelligent automations for modern businesses.
        </p>

        {/* Navigation links */}
        <div className="flex justify-center gap-6 text-sm mb-8">
          <Link href="/" className="text-subtle-gray hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/demos" className="text-subtle-gray hover:text-accent transition-colors">
            Demos
          </Link>
          <Link href="/contact" className="text-subtle-gray hover:text-accent transition-colors">
            Contact
          </Link>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-subtle-gray mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              <span>Dallas, Texas</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              <a href="mailto:contact@barrautomations.com" className="hover:text-accent transition-colors">
                barrautomations@gmail.com
              </a>
            </div>
          </div>

          <p className="text-xs text-center text-subtle-gray">
            &copy; {new Date().getFullYear()} Barr Automations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
