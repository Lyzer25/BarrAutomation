"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Bot } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import GooeyNav from "@/components/bits/Components/GooeyNav/GooeyNav"
import "@/components/bits/Components/GooeyNav/GooeyNav.css"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/demos", label: "Demos" },
  { href: "/integrations", label: "Integrations" },
  { href: "/contact", label: "Contact Us" },
]

export default function Header() {
  const pathname = usePathname()
  const initialActiveIndex = navLinks.findIndex(link => link.href === pathname)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-accent" />
          <span className="text-xl font-bold font-mono text-white">Barri.ai</span>
        </Link>
        <div className="hidden md:flex items-center">
          <GooeyNav items={navLinks} initialActiveIndex={initialActiveIndex !== -1 ? initialActiveIndex : 0} />
        </div>
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/contact">Build My Solution</Link>
          </Button>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "transition-colors hover:text-accent",
                      pathname === link.href ? "text-accent" : "text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
