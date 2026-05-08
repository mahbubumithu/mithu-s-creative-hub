import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/testimonials")({
  component: () => <CrudTable title="Testimonials" table="testimonials" orderBy={{ column: "display_order" }}
    fields={[
      { key: "name", label: "Name", required: true },
      { key: "role", label: "Role" },
      { key: "content", label: "Content", type: "textarea", required: true },
      { key: "avatar_url", label: "Avatar URL", type: "image" },
      { key: "display_order", label: "Order", type: "number" },
    ]}
    listFields={["name", "role", "content"]}
  />,
});
