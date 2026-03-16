import Image from "next/image";
import Link from "next/link";
import { Leaf, Users, Globe, HeartHandshake, Link2, Database } from "lucide-react";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";

const cohortStats = [
  { value: "20", label: "Founders" },
  { value: "$42M", label: "Capital Deployed" },
  { value: "240%", label: "Avg. Growth Rate" },
];

const visionaries = [
  {
    name: "Aeris Bio", stage: "Pre-Seed",
    quote: "Secured $3.2M seed round to scale zero-waste agricultural packaging across Southeast Asia.",
    founderName: "Elara Vance", founderRole: "CEO & Founder",
    companyImage: "https://images.unsplash.com/photo-1543133530-4806c7d3ad80?auto=format&fit=crop&q=80&w=800",
    founderImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100",
    offset: false,
  },
  {
    name: "Solara Systems", stage: "Series A",
    quote: "Expanded operations to 4 new regional markets, achieving a 300% increase in energy grid efficiency.",
    founderName: "Julian Thorne", founderRole: "Founder",
    companyImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    founderImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    offset: true,
  },
  {
    name: "Lattice Flow", stage: "Seed",
    quote: "Awarded the 2024 Global Impact Prize for advances in atmospheric carbon capture tech.",
    founderName: "Sienna Ross", founderRole: "Chief Scientist",
    companyImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    founderImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    offset: false,
  },
];

const milestones = [
  {
    month: "Month 01 — January", title: "The Seed Immersion", side: "left",
    desc: "Founders gathered in Stockholm for intensive tactical alignment and root-cause analysis of their respective missions.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400",
  },
  {
    month: "Month 04 — April", title: "Institutional Resonance", side: "right",
    desc: "A curated gathering with over 40 institutional LPs. Cohort members showcased progress and strategic roadmaps for scaling.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400",
  },
  {
    month: "Month 09 — September", title: "The Impact Audit", side: "left",
    desc: "Third-party verification of social and environmental performance across all cohort companies. Benchmarks were set for 2025.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
  },
];

const impactMetrics = [
  { icon: Leaf, value: "120k", label: "Tons of CO2 Mitigated" },
  { icon: Users, value: "45,000", label: "Jobs Created Globally" },
  { icon: Globe, value: "14", label: "Emerging Markets Reached" },
  { icon: HeartHandshake, value: "$12.5M", label: "Social Value Generated" },
];

export default function CohortPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-16 sm:pt-20">

        {/* Hero */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-beige/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 sm:gap-12 reveal">
              <div className="max-w-2xl">
                <span className="text-forest/40 font-bold uppercase tracking-[0.4em] text-[10px] block mb-3 sm:mb-4">The 2024 Collection</span>
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl text-forest leading-tight mb-6 sm:mb-8">
                  The Growth <span className="italic font-normal text-forest/70">Cohort.</span>
                </h1>
                <p className="text-base sm:text-lg text-forest/60 max-w-lg leading-relaxed">
                  An editorial selection of twenty visionary companies redefining sustainability through deep technology.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full lg:w-auto pb-2">
                {cohortStats.map(({ value, label }) => (
                  <div key={label} className="stat-border pl-4 sm:pl-8">
                    <span className="block font-serif text-2xl sm:text-4xl text-forest mb-1">{value}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-forest/40">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Visionaries */}
        <section className="py-20 sm:py-32 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10 sm:mb-16 reveal">
              <h2 className="font-serif text-3xl sm:text-4xl text-forest italic">Cohort Visionaries</h2>
              <Link href="#" className="text-xs font-bold uppercase tracking-widest text-forest border-b border-forest/20 pb-1">View All</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-16">
              {visionaries.map(({ name, stage, quote, founderName, founderRole, companyImage, founderImage, offset }, i) => (
                <div key={name} className="reveal group cursor-pointer" style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
                  <div className={`aspect-[4/5] overflow-hidden mb-5 sm:mb-6 bg-beige ${offset ? "sm:translate-y-0 lg:translate-y-12" : ""}`}>
                    <Image src={companyImage} alt={name} width={800} height={1000} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                  </div>
                  <div className={offset ? "lg:pt-12" : ""}>
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <h3 className="font-serif text-2xl sm:text-3xl text-forest">{name}</h3>
                      <span className="px-2 sm:px-3 py-1 bg-forest/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-forest/50 flex-shrink-0 ml-2">{stage}</span>
                    </div>
                    <p className="text-forest/60 text-sm leading-relaxed mb-4 sm:mb-6 italic">"{quote}"</p>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden relative flex-shrink-0">
                        <Image src={founderImage} alt={founderName} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-forest">{founderName}</p>
                        <p className="text-[10px] text-forest/40">{founderRole}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collaboration */}
        <section className="py-20 sm:py-32 px-4 sm:px-8 bg-beige/10 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5 reveal">
              <span className="text-forest/40 font-bold uppercase tracking-[0.4em] text-[10px] block mb-3 sm:mb-4">The Mycelium Project</span>
              <h2 className="font-serif text-4xl sm:text-5xl text-forest mb-6 sm:mb-8">
                Collective <span className="italic font-normal">Intelligence</span>
              </h2>
              <p className="text-base sm:text-lg text-forest/70 leading-relaxed mb-8 sm:mb-10">
                We foster active collaboration between cohort members. The Mycelium Project connects disparate technologies to build holistic solutions for global challenges.
              </p>
              <div className="space-y-6 sm:space-y-8">
                {[
                  { icon: Link2, title: "Supply Chain Synergy", desc: "Aeris Bio and Solara are co-developing solar-powered biodegradable shipping solutions." },
                  { icon: Database, title: "Open Data Initiative", desc: "Five cohort members are sharing real-time impact metrics to accelerate R&D benchmarks." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 sm:gap-6 group cursor-pointer">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-forest flex-shrink-0 flex items-center justify-center text-white">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase tracking-widest text-xs text-forest mb-1 sm:mb-2">{title}</h4>
                      <p className="text-sm text-forest/60">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="#" className="btn-primary inline-block mt-10 sm:mt-12 px-8 py-4 bg-forest text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                View All Partnerships
              </Link>
            </div>

            <div className="lg:col-span-7 relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 reveal">
                <div className="w-full h-[240px] sm:h-[400px] relative asymmetric-image overflow-hidden shadow-2xl">
                  <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" alt="Lab" fill className="object-cover" />
                </div>
                <div className="w-full h-[240px] sm:h-[400px] relative asymmetric-image overflow-hidden shadow-2xl mt-8 sm:mt-12">
                  <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Team" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones — simplified on mobile */}
        <section className="py-20 sm:py-40 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-24 reveal">
              <h2 className="font-serif text-4xl sm:text-5xl text-forest">Cohort Milestones</h2>
              <p className="text-forest/40 text-sm mt-3 sm:mt-4 uppercase tracking-[0.2em]">A 12-Month Journey of Rigor</p>
            </div>
            <div className="space-y-10 sm:space-y-24">
              {milestones.map(({ month, title, desc, image, side }, i) => (
                <div key={title} className="reveal" style={{ animationDelay: `${i * 0.2}s` }}>
                  {/* Mobile: stacked layout */}
                  <div className="flex flex-col sm:hidden gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-forest flex-shrink-0" />
                      <span className="text-[10px] font-bold text-forest/40 uppercase tracking-widest">{month}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-forest pl-8">{title}</h3>
                    <p className="text-sm text-forest/60 leading-relaxed pl-8">{desc}</p>
                  </div>

                  {/* Desktop: alternating layout */}
                  <div className={`hidden sm:flex flex-row ${side === "right" ? "flex-row-reverse" : ""} items-center justify-between gap-12 relative`}>
                    <div className={`w-[45%] ${side === "left" ? "text-right" : ""}`}>
                      <span className="text-[10px] font-bold text-forest/40 uppercase tracking-widest mb-2 block">{month}</span>
                      <h3 className="font-serif text-3xl text-forest">{title}</h3>
                      <p className="text-sm text-forest/60 leading-relaxed mt-4">{desc}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-forest border-4 border-cream z-10 flex-shrink-0" />
                    <div className="w-[45%] opacity-20">
                      <div className="w-full h-28 relative asymmetric-image overflow-hidden">
                        <Image src={image} alt={title} fill className="object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="py-20 sm:py-32 px-4 sm:px-8 bg-forest text-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 sm:mb-20 reveal">
              <span className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px] block mb-3 sm:mb-4">Impact Dashboard</span>
              <h2 className="font-serif text-4xl sm:text-5xl">
                Measuring <span className="italic font-normal">Transformation</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-12 reveal" style={{ animationDelay: "0.2s" }}>
              {impactMetrics.map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-white/5 p-6 sm:p-10 border border-white/10">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-5 sm:mb-8 opacity-40" />
                  <h4 className="text-2xl sm:text-3xl font-serif mb-1 sm:mb-2">{value}</h4>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 sm:py-40 px-4 sm:px-8 bg-cream">
          <div className="max-w-5xl mx-auto text-center reveal">
            <h2 className="font-serif text-4xl sm:text-6xl text-forest mb-8 sm:mb-12">
              The 2025 Cycle is <span className="italic font-normal">Opening.</span>
            </h2>
            <p className="text-base sm:text-xl text-forest/60 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-16">
              We are looking for the next twenty seeds of change. If you are building with purpose and technical rigor, we want to nurture your growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link href="/startups" className="btn-primary w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-forest text-white font-bold uppercase text-xs tracking-widest shadow-2xl hover:opacity-90 transition-all text-center">
                Apply for the 2025 Cohort
              </Link>
              <Link href="#" className="w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 border border-forest/20 text-forest font-bold uppercase text-xs tracking-widest hover:bg-beige transition-colors text-center">
                View Selection Criteria
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}