import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/education")({
  component: () => <CrudTable title="Education" table="education" orderBy={{ column: "display_order" }}
    fields={[
      { key: "degree", label: "Degree", required: true },
      { key: "institution", label: "Institution", required: true },
      { key: "year", label: "Year" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "display_order", label: "Order", type: "number" },
    ]}
    listFields={["degree", "institution", "year"]}
  />,
});
