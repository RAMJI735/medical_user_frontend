export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.9),rgba(254,234,228,0.75),rgba(254,243,199,0.5))]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0.05))]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 lg:px-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="grid flex-1 gap-10 rounded-4xl border border-white/40 bg-white/85 p-8 shadow-2xl shadow-rose-900/10 backdrop-blur-xl lg:p-12">
          <div className="aspect-4/5 w-full overflow-hidden rounded-4xl bg-rose-200/80" />
        </div>

        <div className="flex-1 space-y-6 text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-700">Your Dream Wedding Starts Here</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Welcome to Shaadi Expert
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-slate-700 sm:mx-0 sm:text-lg">
            Lucknow’s premier wedding planning company offers top-notch services to make your special day unforgettable.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full bg-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-700/20 transition hover:bg-rose-600"
            >
              Get Started
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-rose-700/20 bg-white px-6 py-3 text-sm font-semibold text-rose-950 transition hover:bg-rose-50"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
