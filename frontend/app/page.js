import Link from 'next/link';
import SiteHeader from '@/components/site-header';
import HeroCards from '@/components/hero-cards';

const steps = [
  { id: '01', title: 'Upload Your Photo', text: 'Upload a JPEG or PNG photo that will become your card marker.' },
  { id: '02', title: 'Attach a Memory', text: 'Add video, GIF, or audio to bring the memory to life.' },
  { id: '03', title: 'Generate Card', text: 'Memora creates a shareable card with a QR code and tracking target.' },
  { id: '04', title: 'Scan & Experience', text: 'Recipients scan and view the AR experience directly in browser.' }
];

const features = [
  'App-free WebAR viewer',
  'QR code generated per card',
  'Public/private card visibility',
  'Card dashboard with scan counts',
  'Shareable viewer links'
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="container grid gap-8 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="badge">WebAR · No App Required</span>
            <h1 className="mt-4 text-5xl leading-tight">Your photos deserve to breathe.</h1>
            <p className="mt-4 max-w-md text-sm text-[#8c7355]">
              Memora transforms printed photo cards into living memories with video, GIF, and audio overlays.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/cards/new" className="btn-primary">Create Your First Card</Link>
              <Link href="/dashboard" className="btn-secondary">Open Dashboard</Link>
            </div>
          </div>
          <HeroCards />
        </section>

        <section id="how" className="bg-[#fff8ee] py-16">
          <div className="container">
            <p className="text-center text-xs uppercase tracking-[0.18em] text-[#E8734A]">The Process</p>
            <h2 className="mt-2 text-center text-4xl">Four steps to a living memory</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {steps.map((step) => (
                <article key={step.id} className="card text-center">
                  <p className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#f0ddc7] text-sm text-[#E8734A]">
                    {step.id}
                  </p>
                  <h3 className="mt-4 text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm text-[#8c7355]">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="container py-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[#E8734A]">MVP Features</p>
          <h2 className="mt-2 text-4xl">Built for the core value loop</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="card text-sm">{feature}</div>
            ))}
          </div>
        </section>

        <section id="use-cases" className="bg-[#1A1208] py-16 text-white">
          <div className="container text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-[#F5C878]">Begin now</p>
            <h2 className="mt-2 text-4xl">Give your memories a voice</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#f0d9be]">
              Create your first Memora card in under 3 minutes and share an app-free AR experience.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/sign-up" className="btn-primary">Create Free Account</Link>
              <Link href="/view/demo-card" className="btn-secondary border-[#72523e] text-[#f5c878]">Try Demo Viewer</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
