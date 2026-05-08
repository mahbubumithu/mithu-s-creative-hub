import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { fetchProjects, fetchTestimonials } from "@/lib/queries";
import { ExternalLink, Quote } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — MD Mahbub Uddin" },
      { name: "description", content: "Selected projects and case studies." },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const { data: testimonials = [] } = useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">My work</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Portfolio</h1>

        {projects.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Projects will be added soon.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary hover:shadow-glow">
                {p.image_url && (
                  <div className="aspect-video overflow-hidden bg-secondary">
                    <img src={p.image_url} alt={p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  {p.category && <p className="text-xs uppercase tracking-wider text-primary">{p.category}</p>}
                  <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.description}</p>
                  {p.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (<span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{t}</span>))}
                    </div>
                  )}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Kind words</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Testimonials</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border bg-card p-6">
                <Quote className="h-6 w-6 text-primary" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">"{t.content}"</p>
                <div className="mt-4 flex items-center gap-3">
                  {t.avatar_url && <img src={t.avatar_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />}
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
