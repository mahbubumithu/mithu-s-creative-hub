import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/tools")({
  component: () => <CrudTable title="Tools" table="tools" orderBy={{ column: "display_order" }}
    fields={[
      { key: "name", label: "Name", required: true },
      { key: "image_url", label: "Image URL", type: "image", required: true, placeholder: "https://cdn.simpleicons.org/docker/2496ED" },
      { key: "category", label: "Category" },
      { key: "display_order", label: "Order", type: "number" },
    ]}
    listFields={["image_url", "name", "category"]}
  />,
});
