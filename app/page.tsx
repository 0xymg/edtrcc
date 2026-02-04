"use client"

import Link from "next/link"
import { Notepad } from "@/components/notepad"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  FileText,
  Code2,
  Zap,
  Moon,
  Shield,
  Layers,
  ArrowRight,
  Github,
  Twitter,
  ExternalLink,
  Search,
  CheckCircle2,
  Printer,
  MousePointer2,
  Globe2,
  Lock,
  Bookmark,
  Monitor
} from "lucide-react"

import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-muted bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-sm bg-foreground text-background">
              <img src="/icon.svg" alt="EDTR Logo" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">

            <Link href="/notepad">
              <Button size="sm" variant="outline" className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background font-bold px-6">
                LAUNCH EDITOR
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section with Integrated Demo */}
        <section className="relative overflow-hidden border-b border-muted pt-12 pb-20 lg:pt-20 lg:pb-32">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Headlines */}
              <div className="lg:col-span-5 space-y-8 text-left">
                <Badge variant="outline" className="rounded-none border-foreground/20 py-1 px-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                  ONLINE NOTEPAD++
                </Badge>
                <h1 className="text-4xl font-black tracking-tighter uppercase sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-left-4 duration-1000">
                  Simple. <br />
                  <span className="text-muted-foreground">Powerful.</span>
                </h1>
                <p className="max-w-md text-lg text-muted-foreground sm:text-xl font-medium animate-in fade-in slide-in-from-left-5 duration-1000 delay-200">
                  The legendary efficiency of Notepad++, available in your browser.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row animate-in fade-in slide-in-from-left-6 duration-1000 delay-300">
                  <Link href="/notepad">
                    <Button size="lg" className="h-14 rounded-none px-8 text-md font-black uppercase tracking-wide bg-foreground text-background hover:bg-muted-foreground">
                      GO TO APP
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="h-14 rounded-none px-8 text-md font-bold uppercase tracking-wide border-2 border-foreground hover:bg-foreground hover:text-background">
                    GITHUB <Github className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Center Column: The Demo Card */}
              <div className="lg:col-span-7 relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-muted/20 to-transparent blur-3xl" />
                <Card className="relative rounded-none border-2 border-foreground/10 bg-background shadow-[30px_30px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden animate-in zoom-in-95 duration-1000 delay-200">
                  <div className="h-[500px] w-full border-t">
                    <Notepad />
                  </div>
                </Card>
                <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 animate-in fade-in delay-500">
                  <div className="flex items-center gap-2"><kbd className="border border-muted-foreground/30 px-1 bg-muted/50">CMD+S</kbd> SAVE</div>
                  <div className="flex items-center gap-2"><kbd className="border border-muted-foreground/30 px-1 bg-muted/50">CMD+J</kbd> NEW TAB</div>
                  <div className="flex items-center gap-2"><kbd className="border border-muted-foreground/30 px-1 bg-muted/50">CMD+K</kbd> CLOSE TAB</div>
                  <div className="flex items-center gap-2"><kbd className="border border-muted-foreground/30 px-1 bg-muted/50">CMD+L</kbd> SIDEBAR</div>
                </div>
              </div>


            </div>
          </div>
        </section>

        {/* Features Showcase Section */}
        <section id="features" className="py-20 lg:py-32 border-b border-muted">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <Badge variant="outline" className="mb-4 rounded-none border-foreground uppercase text-[10px] font-bold px-6">CORE UTILITIES</Badge>
              <h2 className="text-4xl font-black tracking-tight uppercase italic">Engineered for Focus</h2>
            </div>

            <div className="grid gap-px bg-muted border border-muted lg:grid-cols-3">
              {[
                {
                  title: "MINIMAL INTERFACE",
                  description: "Derived from the classics. A distraction-free environment that puts your content first.",
                  icon: MousePointer2
                },
                {
                  title: "INSTANT AUTOSAVE",
                  description: "Every keystroke is persisted locally. Zero data loss, zero cloud dependency.",
                  icon: Zap
                },
                {
                  title: "REAL-TIME METRICS",
                  description: "Precision tracking for lines, words, and characters as you type.",
                  icon: FileText
                },
                {
                  title: "SYNTAX ENGINE",
                  description: "Intelligent highlighting for 20+ programming languages.",
                  icon: Code2
                },
                {
                  title: "NATIVE SPELLCHECK",
                  description: "Leverages browser intelligence for error-free drafting.",
                  icon: CheckCircle2
                },
                {
                  title: "PDF CAPABILITIES",
                  description: "One-click high-fidelity printing and digital export.",
                  icon: Printer
                }
              ].map((item, i) => (
                <div key={i} className="bg-background p-10 transition-colors hover:bg-muted/20">
                  <div className="mb-6 h-10 w-10 text-foreground">
                    <item.icon className="stroke-2" />
                  </div>
                  <h3 className="mb-4 text-lg font-black uppercase tracking-tight italic">{item.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section id="how-it-works" className="py-20 lg:py-32">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="space-y-16">
              <div className="border-l-4 border-foreground pl-8">
                <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-8">Technical Overview</h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  EDTR is a <strong>free online notepad</strong> and browser-exclusive code environment. <strong>Inspired by the functional purity of Notepad++</strong>, we prioritize raw execution over visual bloat, providing a seamless workspace for your ideas, to-do lists, and technical documentation.
                </p>
                <p className="text-xl text-muted-foreground leading-relaxed mt-4 font-medium">
                  Unlike traditional word processors, EDTR focuses on <strong>high-performance plain text</strong>. We leverage HTML5 for persistent draft cycles that stay on your device—private, secure, and always accessible.
                </p>
              </div>

              <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                <div className="border border-muted p-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4" /> AUTOSAVE
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase">
                    Your work is never lost. Automatic persistence ensures your drafts remain even if the browser closes.
                  </p>
                </div>
                <div className="border border-muted p-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" /> PRIVACY
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase">
                    Stored locally on your device. No servers. No tracking. Your notes are available only to you.
                  </p>
                </div>
                <div className="border border-muted p-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-foreground flex items-center gap-2">
                    <Globe2 className="h-4 w-4" /> MULTI-TAB
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase">
                    A true multi-page notepad experience. Manage multiple files and ideas simultaneously with ease.
                  </p>
                </div>
                <div className="border border-muted p-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-foreground flex items-center gap-2">
                    <Monitor className="h-4 w-4" /> PURE TEXT
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase">
                    No rich text formatting. Just raw, high-performance execution for developers and power users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Contributions Section */}
        <section className="py-20 lg:py-32 bg-black text-white px-4 lg:px-0">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
              <Badge variant="outline" className="rounded-none border-white/20 py-1 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Community Driven
              </Badge>
              <h2 className="text-4xl font-black tracking-tighter uppercase sm:text-5xl lg:text-6xl italic text-white">
                Open Source & <br />
                <span className="opacity-50">Contributions</span>
              </h2>
              <p className="text-lg opacity-80 font-medium leading-relaxed text-white">
                EDTR is a <strong>100% open source</strong> utility built for the global developer community. We are open to all contributions as long as they maintain the application&apos;s <strong>purity, simplicity, and raw performance</strong>.
              </p>
              <Button size="lg" variant="secondary" className="h-14 rounded-none px-10 text-md font-black uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-all">
                VIEW ON GITHUB <Github className="ml-2 h-5 w-5" />
              </Button>

              <div className="pt-16 border-t border-background/10 w-full max-w-2xl">
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] mb-8 opacity-60">To Our Contributors: Thank You.</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    "0xymg", // Owner/Primary
                  ].map((username) => (
                    <a
                      key={username}
                      href={`https://github.com/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative h-12 w-12 overflow-hidden border border-background/20 transition-all hover:border-background"
                      title={username}
                    >
                      <img
                        src={`https://github.com/${username}.png`}
                        alt={username}
                        className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0"
                      />
                    </a>
                  ))}
                  <div className="flex h-12 w-12 items-center justify-center border border-dashed border-background/20 text-[10px] font-bold uppercase text-background/40">
                    YOU?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/10 py-20 border-y border-muted">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-xs font-bold tracking-[0.5em] uppercase text-muted-foreground">FREQUENTLY ASKED QUESTIONS</h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "Is it really free?", a: "Yes. EDTR is a utility provided for the creative web. No cost. No hidden fees." },
                { q: "Where is my data?", a: "On your machine. We use LocalStorage, which means your notes never cross the wire." },
                { q: "Offline usage?", a: "Fully supported. Install the PWA to use EDTR anywhere, anytime." },
                { q: "Language support?", a: "20+ languages including Markdown, TypeScript, Python, and JSON." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-muted px-4">
                  <AccordionTrigger className="text-sm font-black uppercase tracking-widest hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-sm font-medium text-muted-foreground uppercase leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>


      </main>

      {/* Footer */}
      <footer className="border-t border-muted bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm bg-foreground text-background">
                <img src="/icon.svg" alt="EDTR Logo" className="h-full w-full object-cover" />
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              © {new Date().getFullYear()} EDTR.CC / BUILT BY YMG.DIGITAL
            </p>


          </div>
        </div>
      </footer>
    </div>
  )
}
