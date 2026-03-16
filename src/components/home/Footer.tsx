"use client";

import Link from "next/link";
import { Leaf, ArrowRight, Twitter, Linkedin, Instagram } from "lucide-react";

const ecosystemLinks = [
  { label: "For Startups", href: "/startups" },
  { label: "For Investors", href: "/investors" },
  { label: "Mentor Network", href: "/mentorship" },
  { label: "Impact Metrics", href: "/cohort" },
];

const philosophyLinks = [
  { label: "Our Mission", href: "/#mission" },
  { label: "The Journal", href: "#journal" },
  { label: "Gatherings", href: "#events" },
  { label: "Purpose at Work", href: "#careers" },
];

const socialLinks = [
  { icon: Twitter, href: "#twitter", label: "Twitter" },
  { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
  { icon: Instagram, href: "#instagram", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="bg-cream border-t border-forest/10 py-16 sm:py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-16">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Leaf className="text-forest w-6 h-6" />
            <span className="font-serif text-2xl font-semibold tracking-tight text-forest">
              VentureHub
            </span>
          </div>
          <p className="text-forest/60 text-sm leading-relaxed max-w-xs">
            An editorial-grade platform for the modern visionary. Curated with care, driven by impact.
          </p>
          <div className="flex gap-4 mt-6 sm:mt-8">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                className="w-10 h-10 rounded-full border border-forest/10 flex items-center justify-center text-forest hover:bg-forest hover:text-white transition-all"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Ecosystem */}
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-forest/40 mb-6 sm:mb-8">
            Ecosystem
          </h5>
          <ul className="space-y-3 sm:space-y-4 text-sm font-medium text-forest/70">
            {ecosystemLinks.map(({ label, href }) => (
              <li key={label} className="hover:text-forest transition-colors">
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Philosophy */}
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-forest/40 mb-6 sm:mb-8">
            Philosophy
          </h5>
          <ul className="space-y-3 sm:space-y-4 text-sm font-medium text-forest/70">
            {philosophyLinks.map(({ label, href }) => (
              <li key={label} className="hover:text-forest transition-colors">
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-forest/40 mb-6 sm:mb-8">
            Intelligence
          </h5>
          <p className="text-sm text-forest/60 mb-4 sm:mb-6">
            Subscribe to our weekly editorial on the future of impact capital.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex border-b border-forest/20 pb-2"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="bg-transparent border-none w-full text-xs text-forest focus:outline-none placeholder:text-forest/30 font-medium py-1"
            />
            <button
              type="submit"
              className="text-forest hover:translate-x-1 transition-transform flex-shrink-0 ml-2"
              aria-label="Subscribe"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 sm:mt-24 pt-8 border-t border-forest/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-forest/30 text-center sm:text-left">
        <p>© 2024 VENTUREHUB TECHNOLOGIES. ALL RIGOR APPLIED.</p>
        <div className="flex gap-4 sm:gap-8">
          {["Privacy Policy", "Terms of Use", "SLA"].map((item) => (
            <Link key={item} href="#" className="hover:text-forest transition-colors">
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}