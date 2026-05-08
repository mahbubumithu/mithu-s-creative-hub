import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      return data;
    },
  });

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
        {isLoading ? (
          <p className="mt-8 text-muted-foreground">Loading…</p>
        ) : !post ? (
          <p className="mt-8 text-muted-foreground">Post not found.</p>
        ) : (
          <>
            <p className="mt-8 text-sm text-primary">{new Date(post.created_at).toLocaleDateString()}</p>
            <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
            {post.image_url && <img src={post.image_url} alt={post.title} className="mt-6 w-full rounded-2xl" />}
            <div className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap text-foreground/90">{post.content}</div>
          </>
        )}
      </article>
    </SiteLayout>
  );
}
