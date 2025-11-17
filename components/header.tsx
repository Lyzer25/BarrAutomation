"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import GooeyNav from "@/components/bits/Components/GooeyNav/GooeyNav"
import "@/components/bits/Components/GooeyNav/GooeyNav.css"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/demos", label: "Demos" },
  { href: "/integrations", label: "Integrations" },
  { href: "/contact", label: "Contact Us" },
]

const productsLinks = [
  { href: "/products/web-development", label: "Web Development" },
  { href: "/products/software-tools", label: "Software & Internal Tools" },
  { href: "/products/scripts-automation", label: "Scripts & Automations" },
  { href: "/products/ai-automations", label: "AI Automations" },
]

export default function Header() {
  const pathname = usePathname()
  const initialActiveIndex = navLinks.findIndex((link) => link.href === pathname)
  const [showProductsDropdown, setShowProductsDropdown] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/barrautomationslogo.png"
            alt="Barr Automations Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold font-mono text-white">Barr Automations</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <GooeyNav items={navLinks} initialActiveIndex={initialActiveIndex !== -1 ? initialActiveIndex : 0} />
          
          <div 
            className="relative group"
            onMouseEnter={() => setShowProductsDropdown(true)}
            onMouseLeave={() => setShowProductsDropdown(false)}
          >
            <button className="flex items-center gap-1 text-white hover:text-accent transition-colors font-medium">
              Products
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {/* Invisible bridge to prevent dropdown from closing */}
            <div className="absolute top-full left-0 w-full h-2" />
            
            {showProductsDropdown && (
              <div className="absolute top-full left-0 w-64 mt-2 bg-black/95 border border-white/10 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden">
                {productsLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 text-sm transition-colors hover:bg-white/5 hover:text-accent border-b border-white/5 last:border-b-0",
                      pathname === link.href ? "text-accent bg-white/5" : "text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
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
                
                {/* Products Section in Mobile Menu */}
                <div className="border-t border-white/10 pt-4">
                  <div className="text-sm font-semibold text-gray-400 mb-3">Products</div>
                  {productsLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block py-2 transition-colors hover:text-accent",
                        pathname === link.href ? "text-accent" : "text-white",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
