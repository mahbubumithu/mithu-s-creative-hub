import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/projects")({
  component: () => <CrudTable title="Projects" table="projects" orderBy={{ column: "display_order" }}
    fields={[
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image_url", label: "Image URL", type: "image" },
      { key: "link", label: "Link" },
      { key: "category", label: "Category" },
      { key: "tags", label: "Tags (comma separated)", type: "tags" },
      { key: "display_order", label: "Order", type: "number" },
    ]}
    listFields={["image_url", "title", "category"]}
  />,
});
