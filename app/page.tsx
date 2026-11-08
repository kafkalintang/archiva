import Link from 'next/link';
import {
  Archive,
  FolderKanban,
  Image as ImageIcon,
  NotebookPen,
  BookOpen,
  Star,
  Search,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Notes', href: '#notes' },
  { label: 'Security', href: '#security' },
];

const features = [
  {
    icon: Archive,
    title: 'Digital Archive',
    description:
      'Store and organize every file, document, photo, and video in one unified workspace.',
  },
  {
    icon: FolderKanban,
    title: 'Smart Folders',
    description:
      'Build nested folders and subfolders that keep your collections perfectly structured.',
  },
  {
    icon: ImageIcon,
    title: 'Media Gallery',
    description:
      'Browse your photos and videos in a beautiful, distraction-free gallery view.',
  },
  {
    icon: NotebookPen,
    title: 'Nine Note Templates',
    description:
      'From sticky notes to meeting minutes — pick the right structure for every thought.',
  },
  {
    icon: BookOpen,
    title: 'Personal Library',
    description:
      'Keep e-books, journals, and reading materials organized with elegant reading lists.',
  },
  {
    icon: Search,
    title: 'Universal Search',
    description:
      'Instantly find any file, note, or bookmark across your entire archive.',
  },
];

const noteTemplates = [
  'Sticky Notes',
  'Checklist',
  'Daily Journal',
  'Weekly Planner',
  'Study Notes',
  'Project Notes',
  'Personal Journal',
  'Meeting Notes',
  'Blank Notes',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-line">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy to-royal flex items-center justify-center shadow-sm">
              <Archive className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-navy">
              ARCHIVA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-soft hover:text-navy transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-navy hover:bg-ice/40 rounded-lg transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-navy to-royal rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-br from-ice via-sky/30 to-transparent rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-line text-xs font-medium text-royal shadow-sm animate-fade">
            <Sparkles className="w-3.5 h-3.5" />
            Personal Digital Archive, reimagined
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-navy leading-tight animate-fade-up">
            Your entire life,{' '}
            <span className="text-gradient">beautifully archived.</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-soft animate-fade-up">
            ARCHIVA is a premium workspace to store files, capture thoughts,
            and organize collections — all in one calm, elegant place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-navy to-royal rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-navy bg-white border border-line rounded-xl hover:border-sky hover:shadow-sm transition-all"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-slate-soft animate-fade">
            {['Free to start', 'No credit card', 'Private by default'].map(
              (t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky" />
                  {t}
                </span>
              )
            )}
          </div>

          {/* Hero preview card */}
          <div className="mt-16 mx-auto max-w-4xl animate-fade-up">
            <div className="relative rounded-3xl border border-line bg-white shadow-xl overflow-hidden">
              <div className="h-9 flex items-center gap-1.5 px-4 border-b border-line bg-surface">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                <div className="bg-sidebar-gradient p-4 text-white">
                  <p className="text-xs opacity-80 mb-3">ARCHIVA</p>
                  {['Dashboard', 'My Notes', 'Media Gallery', 'My Library'].map(
                    (label, i) => (
                      <div
                        key={label}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs mb-1 ${
                          i === 1 ? 'bg-white/20' : 'opacity-80'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-sm bg-white/40" />
                        {label}
                      </div>
                    )
                  )}
                </div>
                <div className="p-6 text-left">
                  <p className="text-xs text-slate-soft">My Notes</p>
                  <h3 className="text-lg font-semibold text-navy mb-3">
                    Your personal space
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Sticky Notes', 'Checklist', 'Daily Journal', 'Meeting Notes'].map(
                      (t) => (
                        <div
                          key={t}
                          className="p-3 rounded-xl border border-line bg-surface text-xs text-navy"
                        >
                          {t}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 bg-white border-y border-line">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-widest text-royal uppercase mb-2">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-navy">
              Everything you need. Nothing you don't.
            </h2>
            <p className="mt-3 text-slate-soft">
              A thoughtfully designed set of tools that feel calm, focused, and
              premium — from quick thoughts to a complete digital library.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl bg-surface border border-line hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy to-royal flex items-center justify-center shadow-sm mb-4 group-hover:scale-105 transition-transform">
                  <f.icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold text-navy mb-1.5">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-soft leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NOTES SHOWCASE ===== */}
      <section id="notes" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-royal uppercase mb-2">
                Nine Note Templates
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-navy">
                Capture every thought with the right structure.
              </h2>
              <p className="mt-4 text-slate-soft leading-relaxed">
                Each note template is purpose-built. A checklist stays a
                checklist. A journal stays a journal. No generic editor forced
                onto everything.
              </p>
              <ul className="mt-6 space-y-2">
                {noteTemplates.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 text-sm text-navy"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-ice to-sky/30 rounded-3xl blur-2xl opacity-40 -z-10" />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: NotebookPen, label: 'Sticky', color: 'from-[#FFE8B0] to-[#FFD98A]' },
                  { icon: NotebookPen, label: 'Checklist', color: 'from-ice to-sky/60' },
                  { icon: NotebookPen, label: 'Journal', color: 'from-[#E8F2FF] to-[#C5E4F6]' },
                  { icon: NotebookPen, label: 'Meeting', color: 'from-[#F0E9FF] to-[#D8C9F5]' },
                ].map((c, i) => (
                  <div
                    key={i}
                    className={`animate-float p-5 rounded-2xl bg-gradient-to-br ${c.color} border border-white shadow-md`}
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    <c.icon className="w-6 h-6 text-navy mb-3" />
                    <p className="text-sm font-semibold text-navy">{c.label}</p>
                    <p className="text-xs text-navy/60 mt-1">
                      Template preview
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <section id="security" className="py-24 bg-white border-y border-line">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ice/60 text-xs font-medium text-navy mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Private by default
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-navy">
            Your archive stays yours.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-slate-soft">
            Encrypted passwords. Secure sessions. A clean data model that never
            leaves you wondering where things are stored.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
            {[
              {
                icon: ShieldCheck,
                title: 'Encrypted credentials',
                desc: 'Passwords hashed with bcrypt — never stored in plain text.',
              },
              {
                icon: Zap,
                title: 'Fast & focused',
                desc: 'A lean, modern stack that loads in milliseconds.',
              },
              {
                icon: Star,
                title: 'Built for personal use',
                desc: 'Designed around how people actually think and collect.',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="p-5 rounded-2xl bg-surface border border-line"
              >
                <s.icon className="w-5 h-5 text-royal mb-3" />
                <h3 className="font-semibold text-navy text-sm mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-soft leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-navy via-royal to-sky p-10 sm:p-14 text-center overflow-hidden shadow-xl">
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top_right,white,transparent_60%)]" />
            <h2 className="relative text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Start archiving today.
            </h2>
            <p className="relative mt-3 text-white/80 max-w-xl mx-auto">
              Create your free ARCHIVA account and bring every file, note, and
              memory into one beautiful place.
            </p>
            <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-navy bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                Create free account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border border-white/40 rounded-xl hover:bg-white/10 transition-all"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-line bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy to-royal flex items-center justify-center">
              <Archive className="w-4 h-4 text-white" strokeWidth={2.2} />
            </div>
            <span className="font-semibold text-navy">ARCHIVA</span>
          </div>
          <p className="text-xs text-slate-soft">
            © {new Date().getFullYear()} ARCHIVA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}