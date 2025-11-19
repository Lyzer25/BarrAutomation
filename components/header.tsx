"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
  const [showProductsDropdown, setShowProductsDropdown] = useState(false)
  const [showDemosDropdown, setShowDemosDropdown] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/barrautomationslogo.png"
            alt="Barr Automations Logo"
            width={40}
            height={40}
            className="h-10 w-10 transition-transform duration-500 group-hover:rotate-180"
          />
          <span className="text-xl font-bold font-mono text-white tracking-tight">Barr Automations</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              pathname === "/" 
                ? "bg-white text-black" 
                : "text-white/70 hover:text-white hover:bg-white/10"
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
            <button 
              className={cn(
                "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                showProductsDropdown || pathname.startsWith('/products')
                  ? "bg-white text-black" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              Products
              <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", showProductsDropdown && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {showProductsDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 pt-2"
                >
                  <div className="w-64 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1">
                    {productsLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "block px-4 py-3 text-sm rounded-xl transition-all duration-200",
                          pathname === link.href 
                            ? "bg-white/10 text-white font-medium" 
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Demos Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowDemosDropdown(true)}
            onMouseLeave={() => setShowDemosDropdown(false)}
          >
            <button 
              className={cn(
                "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                showDemosDropdown || pathname.startsWith('/demos')
                  ? "bg-white text-black" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              Demos
              <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", showDemosDropdown && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {showDemosDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 pt-2"
                >
                  <div className="w-48 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1">
                    {demosLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "block px-4 py-3 text-sm rounded-xl transition-all duration-200",
                          pathname === link.href 
                            ? "bg-white/10 text-white font-medium" 
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Link
            href="/integrations"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              pathname === "/integrations" 
                ? "bg-white text-black" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            Integrations
          </Link>
          
          <Link
            href="/contact"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
              pathname === "/contact" 
                ? "bg-white text-black" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            Contact Us
          </Link>
        </div>
        
        <div className="hidden md:block">
          <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-white px-6 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all duration-300">
            <Link href="/contact">Build My Solution</Link>
          </Button>
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black/95 border-white/10 backdrop-blur-xl">
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
                  <div className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Products</div>
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
                  <div className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Demos</div>
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
