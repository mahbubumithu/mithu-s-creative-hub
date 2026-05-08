import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/services")({
  component: () => <CrudTable title="Services" table="services" orderBy={{ column: "display_order" }}
    fields={[
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "icon", label: "Icon name" },
      { key: "display_order", label: "Order", type: "number" },
    ]}
    listFields={["title", "description"]}
  />,
});
