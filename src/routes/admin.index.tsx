import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

const tables = ["profile","skills","tools","education","experience","certifications","services","projects","testimonials","blog_posts","messages"] as const;

function Overview() {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const out: Record<string, number> = {};
      await Promise.all(tables.map(async (t) => {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        out[t] = count ?? 0;
      }));
      return out;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage your site content from here.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tables.map((t) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.replace("_", " ")}</p>
            <p className="mt-2 text-3xl font-bold text-gradient">{counts?.[t] ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
