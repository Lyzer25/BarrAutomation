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
  { href: "/integrations", label: "Integrations" },
  { href: "/contact", label: "Contact Us" },
]

const productsLinks = [
  { href: "/products/web-development", label: "Web Development" },
  { href: "/products/software-tools", label: "Software & Internal Tools" },
  { href: "/products/scripts-automation", label: "Scripts & Automations" },
  { href: "/products/ai-automations", label: "AI Automations" },
]

const demosLinks = [
  { href: "/demos/ai-demos", label: "AI Demos" },
]

export default function Header() {
  const pathname = usePathname()
  const initialActiveIndex = navLinks.findIndex((link) => link.href === pathname)
  const [showProductsDropdown, setShowProductsDropdown] = useState(false)
  const [showDemosDropdown, setShowDemosDropdown] = useState(false)

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
          <Link
            href="/"
            className={cn(
              "text-white hover:text-accent transition-colors font-medium",
              pathname === "/" && "text-accent"
            )}
          >
            Home
          </Link>
          
          {/* Products Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowProductsDropdown(true)}
            onMouseLeave={() => setShowProductsDropdown(false)}
          >
            <button className="flex items-center gap-1 text-white hover:text-accent transition-colors font-medium">
              Products
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showProductsDropdown && (
              <div className="absolute top-full left-0">
                <div className="w-64 bg-black/95 border border-white/10 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden pt-2">
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
              </div>
            )}
          </div>
          
          {/* Demos Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowDemosDropdown(true)}
            onMouseLeave={() => setShowDemosDropdown(false)}
          >
            <button className="flex items-center gap-1 text-white hover:text-accent transition-colors font-medium">
              Demos
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showDemosDropdown && (
              <div className="absolute top-full left-0">
                <div className="w-64 bg-black/95 border border-white/10 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden pt-2">
                  {demosLinks.map((link) => (
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
              </div>
            )}
          </div>
          
          <Link
            href="/integrations"
            className={cn(
              "text-white hover:text-accent transition-colors font-medium",
              pathname === "/integrations" && "text-accent"
            )}
          >
            Integrations
          </Link>
          
          <Link
            href="/contact"
            className={cn(
              "text-white hover:text-accent transition-colors font-medium",
              pathname === "/contact" && "text-accent"
            )}
          >
            Contact Us
          </Link>
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
                <Link
                  href="/"
                  className={cn(
                    "transition-colors hover:text-accent",
                    pathname === "/" ? "text-accent" : "text-white",
                  )}
                >
                  Home
                </Link>
                
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
                
                {/* Demos Section in Mobile Menu */}
                <div className="border-t border-white/10 pt-4">
                  <div className="text-sm font-semibold text-gray-400 mb-3">Demos</div>
                  {demosLinks.map((link) => (
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
                
                <Link
                  href="/integrations"
                  className={cn(
                    "transition-colors hover:text-accent",
                    pathname === "/integrations" ? "text-accent" : "text-white",
                  )}
                >
                  Integrations
                </Link>
                
                <Link
                  href="/contact"
                  className={cn(
                    "transition-colors hover:text-accent",
                    pathname === "/contact" ? "text-accent" : "text-white",
                  )}
                >
                  Contact Us
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
