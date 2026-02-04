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
  Bookmark
} from "lucide-react"

import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-muted bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-foreground text-background">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">EDTR++</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#demo" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">Demo</a>
            <a href="#how-it-works" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">Technical</a>
            <Link href="/notepad">
              <Button size="sm" variant="outline" className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background font-bold px-6">
                LAUNCH EDITOR
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32 border-b border-muted">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-6 rounded-none border-foreground/20 py-1 px-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              Next-Gen Precision
            </Badge>
            <h1 className="mb-6 text-6xl font-black tracking-tighter uppercase sm:text-7xl lg:text-8xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 italic">
              Simple. <br />
              <span className="text-muted-foreground">Powerful.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl font-medium animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-200">
              The legendary efficiency of Notepad++, reimagined for the modern web. Built for developers who value raw performance.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
              <Link href="/notepad">
                <Button size="lg" className="h-14 rounded-none px-10 text-lg font-black uppercase tracking-wide bg-foreground text-background hover:bg-muted-foreground">
                  START WRITING NOW
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 rounded-none px-8 text-lg font-bold uppercase tracking-wide border-2 border-foreground hover:bg-foreground hover:text-background">
                GITHUB <Github className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="bg-muted/30 py-20 lg:py-32 border-b border-muted">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight uppercase">Workspace Demo</h2>
              <div className="h-1 w-20 bg-foreground mx-auto mb-4" />
              <p className="mx-auto max-w-2xl text-muted-foreground font-medium">
                The full desktop experience, optimized for the browser. No friction, just focus.
              </p>
            </div>

            <div className="mx-auto max-w-5xl animate-in fade-in zoom-in-95 duration-1000">
              <Card className="rounded-none border-2 border-foreground/10 bg-background shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="h-[500px] w-full border-t">
                  <Notepad />
                </div>
              </Card>
              <div className="mt-8 flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2"><kbd className="border border-muted-foreground/30 px-1">CMD+S</kbd> SAVE</div>
                <div className="flex items-center gap-2"><kbd className="border border-muted-foreground/30 px-1">CMD+J</kbd> NEW TAB</div>
                <div className="flex items-center gap-2">PWA INSTALLABLE</div>
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
                  EDTR++ is a browser-exclusive environment built for the modern technical workflow. <strong>Inspired by the functional purity of Notepad++</strong>, we prioritize execution over aesthetics, giving you the fastest tools in the industry.
                </p>
                <p className="text-xl text-muted-foreground leading-relaxed mt-4 font-medium">
                  We leverage <strong>HTML5 LocalStorage</strong> for persistent data cycles that never touch a server. Your privacy is not a feature; it is the foundation.
                </p>
              </div>

              <div className="grid gap-12 sm:grid-cols-2">
                <div className="border border-muted p-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-foreground flex items-center gap-2">
                    <Zap className="h-4 w-4" /> ARCHITECTURE
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase">
                    Zero-Latency persistent cycles via browser API. No login. No database. No tracking. Pure utility.
                  </p>
                </div>
                <div className="border border-muted p-8">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-foreground flex items-center gap-2">
                    <Globe2 className="h-4 w-4" /> COMPATIBILITY
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-semibold uppercase">
                    Universal support for all modern rendering engines. Offline capability via PWA standards.
                  </p>
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
                { q: "Is it really free?", a: "Yes. EDTR++ is a utility provided for the creative web. No cost. No hidden fees." },
                { q: "Where is my data?", a: "On your machine. We use LocalStorage, which means your notes never cross the wire." },
                { q: "Offline usage?", a: "Fully supported. Install the PWA to use EDTR++ anywhere, anytime." },
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

        {/* CTA Section */}
        <section className="py-24 lg:py-40">
          <div className="container mx-auto px-4">
            <div className="bg-foreground text-background p-12 lg:p-24 text-center">
              <h2 className="mb-8 text-5xl font-black uppercase tracking-tighter italic sm:text-6xl">Ready for High-Performance?</h2>
              <div className="h-2 w-32 bg-background mx-auto mb-10" />
              <Link href="/notepad">
                <Button size="lg" variant="secondary" className="h-16 rounded-none px-12 text-xl font-black uppercase tracking-widest bg-background text-foreground hover:bg-muted-foreground transition-all">
                  INITIALIZE EDITOR
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-muted bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-foreground text-[12px] text-background font-black italic">
                E+
              </div>
              <span className="font-extrabold uppercase tracking-widest text-xl">EDTR++</span>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              © {new Date().getFullYear()} EDTR.CC / ENGINEERED BY YMG.DIGITAL / BUILT FOR UTILITY.
            </p>

            <div className="flex items-center gap-6">
              <Twitter className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-all" />
              <Github className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-all" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
