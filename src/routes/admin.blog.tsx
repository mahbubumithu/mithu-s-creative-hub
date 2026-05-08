import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/blog")({
  component: () => <CrudTable title="Blog Posts" table="blog_posts" orderBy={{ column: "created_at", ascending: false }}
    fields={[
      { key: "title", label: "Title", required: true },
      { key: "slug", label: "Slug (url-friendly)", required: true, placeholder: "my-post" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "content", label: "Content", type: "textarea", required: true },
      { key: "image_url", label: "Cover image URL", type: "image" },
      { key: "published", label: "Published", type: "switch" },
    ]}
    listFields={["title", "slug", "published"]}
  />,
});
