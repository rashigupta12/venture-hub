import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 sm:py-40 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-forest -z-10" />
      <div className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-white/5 organic-blob -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white mb-6 sm:mb-10 leading-tight">
          Ready to plant the seeds of your{" "}
          <span className="italic font-normal">legacy?</span>
        </h2>
        <p className="text-white/60 text-base sm:text-xl max-w-2xl mx-auto mb-10 sm:mb-16 font-light leading-relaxed">
          Join a curated collective where purpose meets precision. We are now accepting
          applications for the 2024 Growth Cohort.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/startups"
            className="w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-white text-forest font-bold uppercase text-xs tracking-widest shadow-2xl hover:bg-beige transition-colors text-center"
          >
            Apply for Capital
          </Link>
          <Link
            href="/mentorship"
            className="w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 border border-white/20 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-colors text-center"
          >
            Become a Mentor
          </Link>
        </div>
      </div>
    </section>
  );
}