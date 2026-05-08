import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/skills")({
  component: () => <CrudTable title="Skills" table="skills" orderBy={{ column: "display_order" }}
    fields={[
      { key: "name", label: "Name", required: true },
      { key: "percentage", label: "Percentage (0-100)", type: "number", required: true },
      { key: "display_order", label: "Order", type: "number" },
    ]}
    listFields={["name", "percentage", "display_order"]}
  />,
});
