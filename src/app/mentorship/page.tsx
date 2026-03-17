import Image from "next/image";
import Link from "next/link";
import { Search, Star, Link2, Database, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";

const topMentors = [
  {
    name: "Isabella Thorne",
    role: "Product Strategist • Ex-Stripe",
    bio: "Helping series A startups build scalable infrastructure and product-led growth engines with a focus on human centricity.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
    availability: "Available",
  },
  {
    name: "Marcus Holloway",
    role: "Finance & Operations • Meridian Cap",
    bio: "Veteran CFO specializing in capital allocation, sustainable scaling models, and institutional readiness for green-tech.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    availability: "Available",
  },
  {
    name: "Elena Rossi",
    role: "Marketing & Brand • The Lattice",
    bio: "Award-winning brand architect helping impact-driven founders craft narratives that resonate with global audiences.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    availability: "Booked Soon",
  },
];

const additionalMentors = [
  { name: "David Chang", role: "CTO at FlowState", expertise: "Technology", bio: "Infrastructure expert specializing in secure, high-throughput systems." },
  { name: "Sarah Jenkins", role: "Growth Lead", expertise: "Growth", bio: "Growth lead for 3 unicorn exits. Expert in virality loops and community-driven scale." },
  { name: "Robert Vance", role: "Supply Chain Architect", expertise: "Operations", bio: "Focuses on ethical sourcing and lean manufacturing for hardware startups." },
  { name: "Lina Mori", role: "UX Specialist", expertise: "Product", bio: "Bridging the gap between complex tech and human experience." },
];

const filters = ["All Expertise", "Product", "Finance", "Operations", "Marketing", "Growth"];

const processSteps = [
  { num: 1, title: "Identify Expertise Gap", desc: "Use our analytics tools to pinpoint precisely where your leadership team needs tactical support." },
  { num: 2, title: "Curated Matching", desc: "Browse our directory or let our partners suggest advisors aligned with your ethical mission and industry." },
  { num: 3, title: "Strategic Calibration", desc: "Book sessions for deep-dives, ongoing advisory roles, or emergency troubleshooting with proven experts." },
];

export default function MentorshipPage() {
  return (
    <div className="min-h-screen">
      <Navigation activeItem="mentorship" />

      <main className="pt-16 sm:pt-20">

        {/* Header */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-beige/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center gap-3 text-forest/60 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
              <span className="w-6 sm:w-8 h-px bg-forest/30" />
              The Knowledge Layer
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-forest mb-6 sm:mb-8 leading-[1.1]">
              The Architect{" "}
              <span className="italic font-normal underline decoration-forest/20 underline-offset-8">
                Collective.
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-forest/70 max-w-2xl leading-relaxed">
              Connect with world-class operators and visionary leaders dedicated to scaling
              impact-first startups with rigor and empathy.
            </p>

            {/* Search & Filters */}
            <div className="mt-10 sm:mt-16">
              <div className="flex flex-col gap-6 sm:gap-8 border-b border-forest/10 pb-6 sm:pb-8">
                <div className="w-full lg:w-1/2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-forest/40 block mb-2 sm:mb-3">
                    Find your advisor
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-forest/40 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, expertise, or keyword..."
                      className="w-full bg-white/50 border border-forest/10 py-3 sm:py-4 pl-10 sm:pl-12 pr-4 sm:pr-6 focus:ring-1 focus:ring-forest/20 focus:outline-none placeholder:text-forest/30 font-medium text-forest text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {filters.map((f, i) => (
                    <button
                      key={f}
                      className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${
                        i === 0
                          ? "bg-forest text-white"
                          : "border border-forest/10 text-forest/60 hover:border-forest/40"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Mentors */}
        <section className="py-16 sm:py-24 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 sm:mb-16 flex items-center justify-between">
              <h2 className="font-serif text-3xl sm:text-4xl text-forest">
                Top <span className="italic">Advisors</span> this Month
              </h2>
              <Link href="#" className="text-xs font-bold uppercase tracking-widest text-forest/60 hover:text-forest flex items-center gap-1 sm:gap-2 transition-colors">
                View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {topMentors.map(({ name, role, bio, image, availability }) => (
                <div key={name} className="group cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden relative mb-5 sm:mb-6 bg-beige">
                    <Image src={image} alt={name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-forest">
                        {availability}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-forest/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href="/profile" className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-forest font-bold uppercase text-[10px] tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Schedule Session
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl sm:text-2xl text-forest">{name}</h3>
                      <div className="flex gap-0.5 text-forest/40">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-forest/40" />)}
                      </div>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-forest/40 mb-3 sm:mb-4">{role}</p>
                    <p className="text-forest/60 text-sm leading-relaxed line-clamp-2">{bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 sm:py-32 bg-beige/30 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-5">
                <div className="mb-4 sm:mb-6 text-forest/40 font-bold uppercase tracking-[0.4em] text-[10px]">The Process</div>
                <h2 className="font-serif text-4xl sm:text-5xl text-forest mb-6 sm:mb-8 leading-tight">
                  How <span className="italic font-normal">symbiotic</span> growth works.
                </h2>
                <div className="space-y-8 sm:space-y-12">
                  {processSteps.map(({ num, title, desc }) => (
                    <div key={num} className="flex gap-5 sm:gap-6 group">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest text-white flex-shrink-0 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform">
                        {num}
                      </div>
                      <div>
                        <h4 className="font-serif text-lg sm:text-xl text-forest mb-1 sm:mb-2">{title}</h4>
                        <p className="text-forest/60 text-sm leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 relative">
                <div className="relative">
                  <div className="w-full aspect-video relative asymmetric-image overflow-hidden shadow-2xl">
                    <Image src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200" alt="Mentorship" fill className="object-cover" />
                  </div>
                  <div className="absolute -top-8 sm:-top-12 -right-8 sm:-right-12 w-36 sm:w-48 h-36 sm:h-48 bg-forest/5 organic-blob -z-10" />
                  <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 bg-white p-4 sm:p-6 shadow-xl max-w-[240px] sm:max-w-sm">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-beige relative flex-shrink-0">
                        <Image src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100" alt="Elena" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-forest">Real Outcome</p>
                        <p className="font-serif text-base sm:text-lg text-forest">"Saved 6 months of burn"</p>
                      </div>
                    </div>
                    <p className="text-forest/60 text-xs leading-relaxed italic hidden sm:block">
                      "Elena's guidance on our market entry strategy was the pivot point for our Series A success."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Mentors Grid */}
        <section className="py-20 sm:py-32 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
              {additionalMentors.map(({ name, role, expertise, bio }) => (
                <div key={name} className="bg-white p-6 sm:p-8 border border-forest/10 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-5 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-forest/5 flex items-center justify-center text-forest">
                      <span className="text-xl">🧭</span>
                    </div>
                    <span className="px-2 py-1 bg-forest/5 text-[9px] font-bold uppercase tracking-widest text-forest">{expertise}</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl text-forest mb-1">{name}</h3>
                  <p className="text-[10px] text-forest/40 uppercase tracking-widest mb-3">{role}</p>
                  <p className="text-forest/60 text-xs leading-relaxed mb-5 sm:mb-6">{bio}</p>
                  <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-forest border-b border-forest/20 pb-1 hover:border-forest transition-colors">
                    View Schedule
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-12 sm:mt-20 text-center">
              <button className="px-10 sm:px-12 py-4 sm:py-5 border border-forest/20 text-forest font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-beige transition-colors">
                Load More Advisors
              </button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 sm:py-40 px-4 sm:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-forest -z-10" />
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white mb-8 sm:mb-10 leading-tight">
              Have knowledge to <span className="italic font-normal">impart?</span>
            </h2>
            <p className="text-white/60 text-base sm:text-xl max-w-2xl mx-auto mb-10 sm:mb-16 font-light leading-relaxed">
              We are always looking for seasoned veterans who share our passion for impact-driven innovation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link href="/profile" className="btn-primary w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-white text-forest font-bold uppercase text-xs tracking-widest shadow-2xl hover:bg-beige transition-colors text-center">
                Apply to Mentor
              </Link>
              <Link href="#" className="w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 border border-white/20 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-colors text-center">
                Our Philosophy
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}