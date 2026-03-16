"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";

const steps = [
  { num: "01", title: "Founder Identity", sub: "Personal Background" },
  { num: "02", title: "Core Concept", sub: "Business & Industry" },
  { num: "03", title: "Impact Resonance", sub: "Social & Ecology" },
  { num: "04", title: "Capital Needs", sub: "Terms & Deployment" },
  { num: "05", title: "The Collective", sub: "Team & Outreach" },
];

const industryOptions = [
  { value: "climatetech", label: "Climatetech" },
  { value: "biotech", label: "Biotechnology" },
  { value: "agtech", label: "Agtech" },
  { value: "deeptech", label: "Deeptech" },
];

const stages = ["Ideation", "MVP", "Seed / Early"];

export default function StartupsPage() {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState("Seed / Early");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => router.push("/investors"), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activeItem="startups" />

      <main className="flex-1 pt-24 sm:pt-32 pb-20 sm:pb-40 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">

            {/* Sidebar — stacked on mobile, sticky on desktop */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit reveal">
              <span className="text-forest/40 font-bold uppercase tracking-[0.4em] text-[10px] block mb-3 sm:mb-4">
                Apply for Capital
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-forest mb-5 sm:mb-8 leading-tight">
                Plant your <span className="italic">vision.</span>
              </h1>
              <p className="text-forest/70 text-base sm:text-lg leading-relaxed mb-8 sm:mb-12 max-w-sm">
                We partner with founders who see beyond the horizon. Tell us about the legacy
                you intend to build.
              </p>

              {/* Steps — hidden on mobile to save space */}
              <nav className="hidden sm:block space-y-6 sm:space-y-8 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-forest/10" />
                {steps.map(({ num, title, sub }, i) => (
                  <div key={num} className="relative pl-7 sm:pl-8 flex items-center group cursor-pointer">
                    <div
                      className={`absolute left-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${
                        i === 0 ? "bg-forest ring-4 ring-forest/10" : "bg-forest/20"
                      }`}
                    />
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest ${i === 0 ? "text-forest" : "text-forest/40 group-hover:text-forest transition-colors"}`}>
                        {num}. {title}
                      </p>
                      <p className={`text-[10px] uppercase tracking-wider ${i === 0 ? "text-forest/40" : "text-forest/20"}`}>
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </nav>
            </aside>

            {/* Form */}
            <div className="lg:col-span-8 reveal" style={{ animationDelay: "0.2s" }}>
              <div className="bg-white/40 backdrop-blur-sm p-6 sm:p-12 lg:p-20 border border-forest/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-forest/5 organic-blob -translate-y-1/2 translate-x-1/2 -z-10" />

                <form className="space-y-12 sm:space-y-16">

                  {/* Section 1 */}
                  <section className="space-y-8 sm:space-y-10">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-forest mb-2">Founder Identity</h2>
                      <p className="text-sm text-forest/50">The heartbeat of every great venture is its architect.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div>
                        <label className="label-style" htmlFor="founder-name">Full Name</label>
                        <input type="text" id="founder-name" className="input-field" placeholder="Elara Vance" />
                      </div>
                      <div>
                        <label className="label-style" htmlFor="founder-email">Professional Email</label>
                        <input type="email" id="founder-email" className="input-field" placeholder="elara@aeris.bio" />
                      </div>
                    </div>
                    <div>
                      <label className="label-style" htmlFor="founder-bio">Your Story</label>
                      <textarea id="founder-bio" rows={4} className="input-field resize-none" placeholder="Briefly share your journey..." />
                    </div>
                  </section>

                  {/* Section 2 */}
                  <section className="space-y-8 sm:space-y-10 pt-10 sm:pt-16 border-t border-forest/5">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-forest mb-2">Core Concept</h2>
                      <p className="text-sm text-forest/50">Defining the solution and the ecosystem it inhabits.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div>
                        <label className="label-style" htmlFor="company-name">Company Name</label>
                        <input type="text" id="company-name" className="input-field" placeholder="Aeris Bio" />
                      </div>
                      <div>
                        <label className="label-style" htmlFor="industry">Primary Industry</label>
                        <select id="industry" className="input-field appearance-none cursor-pointer bg-transparent">
                          <option value="">Select Industry</option>
                          {industryOptions.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="label-style">Current Stage</label>
                      <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
                        {stages.map((stage) => (
                          <label
                            key={stage}
                            className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 border cursor-pointer transition-colors ${
                              selectedStage === stage
                                ? "bg-forest text-white border-forest"
                                : "bg-beige/50 border-forest/10 hover:bg-beige"
                            }`}
                          >
                            <input
                              type="radio"
                              name="stage"
                              value={stage}
                              checked={selectedStage === stage}
                              onChange={() => setSelectedStage(stage)}
                              className="accent-forest"
                            />
                            <span className={`text-xs font-bold uppercase tracking-widest ${selectedStage === stage ? "text-white" : "text-forest/70"}`}>
                              {stage}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Section 3 */}
                  <section className="space-y-8 sm:space-y-10 pt-10 sm:pt-16 border-t border-forest/5">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-forest mb-2">Impact Resonance</h2>
                      <p className="text-sm text-forest/50">How does your growth enrich the world?</p>
                    </div>
                    <div>
                      <label className="label-style" htmlFor="impact-desc">Environmental or Social Impact</label>
                      <textarea id="impact-desc" rows={4} className="input-field resize-none" placeholder="Describe the intended positive ripple effects of your technology..." />
                    </div>
                    <div>
                      <label className="label-style" htmlFor="impact-metrics">Target Metrics</label>
                      <input type="text" id="impact-metrics" className="input-field" placeholder="e.g. 50k tons of carbon sequestered annually by 2026" />
                    </div>
                  </section>

                  {/* Section 4 */}
                  <section className="space-y-8 sm:space-y-10 pt-10 sm:pt-16 border-t border-forest/5">
                    <div>
                      <h2 className="font-serif text-2xl sm:text-3xl text-forest mb-2">Capital Deployment</h2>
                      <p className="text-sm text-forest/50">The tactical fuel for your strategic vision.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div>
                        <label className="label-style" htmlFor="capital-needed">Capital Requested (USD)</label>
                        <input type="text" id="capital-needed" className="input-field" placeholder="$500,000" />
                      </div>
                      <div>
                        <label className="label-style" htmlFor="funding-period">Planned Use Period</label>
                        <input type="text" id="funding-period" className="input-field" placeholder="18-24 Months" />
                      </div>
                    </div>
                    <div>
                      <label className="label-style" htmlFor="use-funds">Use of Funds</label>
                      <textarea id="use-funds" rows={3} className="input-field resize-none" placeholder="R&D, expansion into NA market, core hiring..." />
                    </div>
                  </section>

                  {/* Actions */}
                  <div className="pt-10 sm:pt-16 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-t border-forest/10">
                    <button type="button" className="text-xs font-bold uppercase tracking-widest text-forest/40 hover:text-forest transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Progress
                    </button>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <button type="button" className="text-center px-8 sm:px-10 py-4 sm:py-5 border border-forest/20 text-forest font-bold uppercase text-xs tracking-[0.2em] hover:bg-beige transition-colors">
                        Next Section
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn-primary text-center px-10 sm:px-12 py-4 sm:py-5 bg-forest text-white font-bold uppercase text-xs tracking-[0.2em] shadow-xl shadow-forest/10"
                      >
                        Submit Application
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-forest/95 z-[100] flex items-center justify-center text-center px-6 sm:px-8">
          <div className="max-w-md">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center text-white mb-6 sm:mb-8 mx-auto">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Application Planted.</h2>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed">
              Your vision is now in our ecosystem. Redirecting you to the Investor Dashboard...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}