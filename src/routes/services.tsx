import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { fetchServices } from "@/lib/queries";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — MD Mahbub Uddin" },
      { name: "description", content: "Cloud architecture, DevOps and infrastructure consulting services." },
    ],
  }),
  component: Services,
});

function Services() {
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">What I offer</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Services</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Comprehensive solutions across cloud, DevOps and enterprise infrastructure.</p>

        {services.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Services will be added soon.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.id} className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-glow">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-primary p-3 text-primary-foreground">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
