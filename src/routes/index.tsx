import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { fetchProfile, fetchSkills, fetchTools, fetchServices } from "@/lib/queries";
import heroImg from "@/assets/hero-portrait.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MD Mahbub Uddin — Solutions Architect" },
      { name: "description", content: "15+ years of IT solutions experience in Bangladesh. Cloud, DevOps, Networks & Systems." },
      { property: "og:title", content: "MD Mahbub Uddin — Solutions Architect" },
      { property: "og:description", content: "15+ years of IT solutions experience in Bangladesh." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const { data: skills = [] } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const { data: tools = [] } = useQuery({ queryKey: ["tools"], queryFn: fetchTools });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-32">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Available for new opportunities
            </div>
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              Hello, I'm <br />
              <span className="text-gradient">{profile?.full_name || "MD Mahbub Uddin"}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {profile?.title || "Solutions Architect"} · {profile?.location && (<><MapPin className="mr-1 inline h-4 w-4" />{profile.location}</>)}
            </p>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{profile?.bio}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/contact">Hire Me <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/portfolio">View Portfolio</Link>
              </Button>
              {profile?.resume_url && (
                <Button asChild size="lg" variant="ghost">
                  <a href={profile.resume_url} target="_blank" rel="noreferrer"><Download className="mr-1 h-4 w-4" />Resume</a>
                </Button>
              )}
            </div>
          </div>
          <div className="relative mx-auto">
            <div className="absolute -inset-4 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
            <div className="relative aspect-square w-72 overflow-hidden rounded-3xl border border-border shadow-glow md:w-96">
              <img src={profile?.avatar_url || heroImg} alt={profile?.full_name || "Portrait"} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader eyebrow="Expertise" title="My Skills" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {skills.map((s) => (
            <div key={s.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-primary">{s.percentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-gradient-primary transition-all duration-1000" style={{ width: `${s.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader eyebrow="Tech Stack" title="Tools & Technologies" subtitle="Cloud platforms, orchestration, automation and data systems I work with daily." />
        <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {tools.map((t) => (
            <div key={t.id} className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-glow">
              <img src={t.image_url} alt={t.name} className="h-10 w-10 object-contain transition-transform group-hover:scale-110" loading="lazy" />
              <span className="text-xs text-muted-foreground">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services teaser */}
      {services.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <SectionHeader eyebrow="What I Do" title="Services" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-elegant">
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-card to-secondary p-10 text-center md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">Let's build something <span className="text-gradient">great</span> together</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Have a project in mind or need an architecture review? I'd love to hear about it.</p>
          <Button asChild size="lg" className="mt-6 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <Link to="/contact">Get in touch <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
