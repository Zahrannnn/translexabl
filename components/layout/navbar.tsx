"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles, Zap } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Blog", href: "/blogs" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <nav className="sticky top-6 z-50 modern-card border-b border-border/20 backdrop-blur-xl w-[90%] mx-auto py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover-lift group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text">TransleXable</span>
              <span className="text-xs text-muted-foreground -mt-1">AI Translation</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className=" hover:text-white text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              asChild 
              className="text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-300 hover-lift"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button 
              asChild 
              className="btn-primary-enhanced text-sm px-6 py-2 h-auto rounded-lg shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/register" className="flex items-center space-x-2">
                <span>Get Started</span>
                <Zap className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="modern-card p-2 hover:bg-primary/10"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 modern-card mt-2 rounded-2xl border border-border/20 shadow-lg shadow-primary/10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-border/20">
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary rounded-xl"
                >
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full btn-primary-enhanced rounded-xl shadow-glow"
                >
                  <Link 
                    href="/register" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center space-x-2"
                  >
                    <span>Get Started</span>
                    <Zap className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 