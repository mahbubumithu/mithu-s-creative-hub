import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { fetchProfile, fetchEducation, fetchExperience, fetchCertifications } from "@/lib/queries";
import { GraduationCap, Briefcase, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MD Mahbub Uddin" },
      { name: "description", content: "Solutions Architect with 15+ years in cloud, DevOps and infrastructure." },
    ],
  }),
  component: About,
});

function About() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const { data: education = [] } = useQuery({ queryKey: ["education"], queryFn: fetchEducation });
  const { data: experience = [] } = useQuery({ queryKey: ["experience"], queryFn: fetchExperience });
  const { data: certs = [] } = useQuery({ queryKey: ["certifications"], queryFn: fetchCertifications });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">About me</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Who I Am</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{profile?.bio}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <InfoRow label="Name" value={profile?.full_name} />
          <InfoRow label="Title" value={profile?.title} />
          <InfoRow label="Location" value={profile?.location} />
          <InfoRow label="Email" value={profile?.email} />
        </div>
      </section>

      <Timeline icon={GraduationCap} title="Education" items={education.map((e) => ({ id: e.id, title: e.degree, sub: e.institution, time: e.year, desc: e.description }))} />
      <Timeline icon={Award} title="Certifications" items={certs.map((e) => ({ id: e.id, title: e.name, sub: e.issuer, time: e.year, desc: "" }))} />
      <Timeline icon={Briefcase} title="Experience" items={experience.map((e) => ({ id: e.id, title: e.title, sub: e.company, time: e.period, desc: e.description }))} />
    </SiteLayout>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value || "—"}</p>
    </div>
  );
}

function Timeline({ icon: Icon, title, items }: { icon: typeof GraduationCap; title: string; items: { id: string; title: string; sub: string; time: string; desc?: string | null }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-primary p-2 text-primary-foreground"><Icon className="h-5 w-5" /></div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="relative space-y-6 border-l-2 border-border pl-6">
        {items.map((it) => (
          <div key={it.id} className="relative">
            <div className="absolute -left-[31px] mt-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
            <p className="text-xs text-primary">{it.time}</p>
            <h3 className="mt-1 font-semibold">{it.title}</h3>
            <p className="text-sm text-muted-foreground">{it.sub}</p>
            {it.desc && <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
