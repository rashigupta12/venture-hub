"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";

interface NavigationProps {
  activeItem?: "home" | "startups" | "investors" | "mentorship" | "mission" | "cohort" | "profile";
}

const navLinks = [
  { key: "startups", label: "Startups", href: "/startups" },
  { key: "investors", label: "Investors", href: "/investors" },
  { key: "mentorship", label: "Mentorship", href: "/mentorship" },
  { key: "mission", label: "Our Mission", href: "/#mission" },
];

export function Navigation({ activeItem = "home" }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-cream/90 backdrop-blur-md border-b border-forest/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Leaf className="text-forest w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-forest">
              VentureHub
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10 text-sm font-medium uppercase tracking-widest text-forest/80">
            {navLinks.map(({ key, label, href }) => (
              <Link
                key={key}
                href={href}
                className={`nav-link relative py-1 transition-colors hover:text-forest ${
                  activeItem === key ? "border-b border-forest text-forest" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/profile"
              className="text-sm font-bold uppercase tracking-widest text-forest hover:opacity-70 transition-opacity"
            >
              Log In
            </Link>
            <Link
              href="/startups"
              className="px-6 xl:px-8 py-3 bg-forest text-white text-xs font-bold uppercase tracking-widest hover:bg-forest/90 transition-all shadow-lg shadow-forest/10"
            >
              Join the Hub
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-4">
            <Link
              href="/profile"
              className="text-xs font-bold uppercase tracking-widest text-forest hover:opacity-70 transition-opacity"
            >
              Log In
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 flex items-center justify-center text-forest"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-forest/20 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Slide-down panel */}
        <div
          className={`absolute top-16 sm:top-20 left-0 right-0 bg-cream border-b border-forest/10 shadow-2xl px-6 py-8 space-y-2 transition-all duration-300 ${
            mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {navLinks.map(({ key, label, href }) => (
            <Link
              key={key}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-bold uppercase tracking-widest py-4 border-b border-forest/5 transition-colors ${
                activeItem === key ? "text-forest" : "text-forest/50 hover:text-forest"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-4">
            <Link
              href="/startups"
              onClick={() => setMobileOpen(false)}
              className="block text-center py-4 bg-forest text-white text-xs font-bold uppercase tracking-widest hover:bg-forest/90 transition-all"
            >
              Join the Hub
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}