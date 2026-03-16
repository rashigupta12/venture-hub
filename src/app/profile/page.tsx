"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Sprout, Landmark, Compass, ShieldCheck, Bell, X, Plus } from "lucide-react";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";

type Role = "founder" | "investor" | "mentor";

const roles = [
  { key: "founder" as Role, icon: Sprout, title: "Founder", desc: "Seeking capital and strategic growth mentorship." },
  { key: "investor" as Role, icon: Landmark, title: "Investor", desc: "Deploying capital to high-impact technical teams." },
  { key: "mentor" as Role, icon: Compass, title: "Mentor", desc: "Providing tactical wisdom to the next generation." },
];

const steps = [
  { num: 1, label: "Profile Basics" },
  { num: 2, label: "Expertise & Bio" },
  { num: 3, label: "Verification" },
  { num: 4, label: "Preferences" },
];

const destinations: Record<Role, string> = {
  founder: "/startups",
  investor: "/investors",
  mentor: "/mentorship",
};

export default function ProfilePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("founder");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => router.push(destinations[selectedRole]), 800);
  };

  return (
    <div className="min-h-screen">
      <Navigation activeItem="profile" />

      <main className="pt-24 sm:pt-32 pb-20 sm:pb-40 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <header className="mb-10 sm:mb-16 reveal" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 text-forest/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-3 sm:mb-4">
              <span className="w-8 sm:w-10 h-px bg-forest/20" />
              Identity & Influence
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-forest leading-tight">
              Complete your <span className="italic">digital roots.</span>
            </h1>
            <p className="text-base sm:text-lg text-forest/60 max-w-xl mt-4 sm:mt-6 leading-relaxed">
              Tailor your VentureHub experience by defining your role and professional parameters within our ecosystem.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

            {/* Steps sidebar — hidden on mobile */}
            <aside className="hidden lg:block lg:col-span-3 reveal" style={{ animationDelay: "0.2s" }}>
              <nav className="sticky top-40 space-y-8">
                {steps.map(({ num, label }) => (
                  <div key={num} className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${num === 1 ? "bg-forest text-white border-forest" : "border-forest/20 text-forest/40"}`}>
                      {num}
                    </span>
                    <span className={`text-xs font-bold uppercase tracking-widest ${num === 1 ? "text-forest" : "text-forest/40"}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </nav>
            </aside>

            {/* Progress bar on mobile */}
            <div className="lg:hidden flex items-center gap-2 mb-4">
              {steps.map(({ num }) => (
                <div key={num} className={`h-1 flex-1 rounded-full ${num === 1 ? "bg-forest" : "bg-forest/10"}`} />
              ))}
            </div>

            {/* Form */}
            <section className="lg:col-span-9 reveal" style={{ animationDelay: "0.3s" }}>
              <div className="bg-beige/40 p-6 sm:p-12 border border-forest/5 shadow-sm space-y-10 sm:space-y-16">

                {/* Role Selection */}
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-forest mb-6 sm:mb-12">
                    I am joining the ecosystem as a:
                  </h3>
                  <div className="grid grid-cols-3 gap-3 sm:gap-6">
                    {roles.map(({ key, icon: Icon, title, desc }) => (
                      <label key={key} className="relative cursor-pointer group">
                        <input type="radio" name="role" value={key} checked={selectedRole === key} onChange={() => setSelectedRole(key)} className="hidden" />
                        <div className={`p-4 sm:p-8 border h-full transition-all group-hover:shadow-lg ${selectedRole === key ? "bg-forest border-forest" : "bg-white border-forest/10"}`}>
                          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-3 sm:mb-6 ${selectedRole === key ? "text-white" : "text-forest"}`} />
                          <h4 className={`font-serif text-sm sm:text-xl mb-1 sm:mb-2 ${selectedRole === key ? "text-white" : "text-forest"}`}>{title}</h4>
                          <p className={`text-[10px] sm:text-xs mt-1 sm:mt-2 hidden sm:block ${selectedRole === key ? "text-white/60" : "text-forest/50"}`}>{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Basics */}
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-forest mb-6 sm:mb-8">Basics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 sm:gap-12 items-start">

                    {/* Avatar */}
                    <div className="sm:col-span-4">
                      <div className="aspect-square bg-white border border-forest/10 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer max-w-[200px] sm:max-w-none mx-auto">
                        <Image
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
                          alt="Profile"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                          <Camera className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Replace Portrait</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-forest/40 uppercase tracking-widest mt-3 text-center">High-res professional portrait</p>
                    </div>

                    {/* Fields */}
                    <div className="sm:col-span-8 space-y-6 sm:space-y-8">
                      <div>
                        <label className="label-style">Full Legal Name</label>
                        <input type="text" className="input-field font-serif text-lg sm:text-xl text-forest" defaultValue="Julian Thorne" />
                      </div>
                      <div>
                        <label className="label-style">Primary Location</label>
                        <input type="text" className="input-field text-base sm:text-lg text-forest" placeholder="e.g. London, United Kingdom" />
                      </div>
                      <div>
                        <label className="label-style">Professional Bio</label>
                        <textarea className="w-full bg-transparent border border-forest/10 p-3 sm:p-4 focus:border-forest focus:ring-0 outline-none h-28 sm:h-32 text-sm leading-relaxed text-forest/70 resize-none" placeholder="Tell us about your mission and previous success stories..." />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-forest mb-6 sm:mb-8">Expertise & Focus</h3>
                  <div className="space-y-8 sm:space-y-10">
                    <div>
                      <label className="label-style">Primary Industries</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["Agritech", "Deep Tech"].map((tag) => (
                          <span key={tag} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-forest text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 sm:gap-2">
                            {tag} <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer" />
                          </span>
                        ))}
                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-forest/10 text-[10px] font-bold uppercase tracking-widest text-forest/60 hover:border-forest hover:text-forest transition-colors flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-12">
                      <div className="flex items-center justify-between p-4 sm:p-6 bg-white border border-forest/5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-forest flex-shrink-0" />
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-widest text-forest">Verification</h5>
                            <p className="text-[10px] text-forest/40">Not yet verified</p>
                          </div>
                        </div>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-forest border-b border-forest flex-shrink-0 ml-2">Verify</button>
                      </div>

                      <div className="flex items-center justify-between p-4 sm:p-6 bg-white border border-forest/5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-forest flex-shrink-0" />
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-widest text-forest">Notifications</h5>
                            <p className="text-[10px] text-forest/40">Enabled for industries</p>
                          </div>
                        </div>
                        <div className="cursor-pointer flex-shrink-0 ml-2" onClick={() => setNotifications(!notifications)}>
                          <div className={`w-10 sm:w-11 h-5 sm:h-6 rounded-full transition-colors relative ${notifications ? "bg-forest" : "bg-forest/20"}`}>
                            <div className={`absolute top-[2px] left-[2px] w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full transition-transform ${notifications ? "translate-x-5" : ""}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between pt-8 sm:pt-12 border-t border-forest/10 gap-4 sm:gap-0">
                  <button className="text-xs font-bold uppercase tracking-widest text-forest/40 hover:text-forest transition-colors">
                    Discard Changes
                  </button>
                  <button
                    onClick={handleSave}
                    className={`w-full sm:w-auto btn-primary px-10 sm:px-12 py-4 sm:py-5 text-xs font-bold uppercase tracking-widest shadow-xl transition-all duration-300 text-center ${
                      saved ? "bg-emerald-600 text-white" : "bg-forest text-white"
                    }`}
                  >
                    {saved ? "✓ Profile Saved" : "Save & Continue"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}