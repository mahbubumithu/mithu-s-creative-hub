import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { fetchBlogPosts } from "@/lib/queries";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — MD Mahbub Uddin" },
      { name: "description", content: "Articles on cloud, DevOps and infrastructure." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const { data: posts = [] } = useQuery({ queryKey: ["blog", true], queryFn: () => fetchBlogPosts(true) });
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Writing</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">Blog</h1>

        {posts.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No articles yet. Check back soon.
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {posts.map((p) => (
              <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-elegant">
                <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                <h2 className="mt-2 text-2xl font-semibold">{p.title}</h2>
                {p.excerpt && <p className="mt-2 text-muted-foreground">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
