import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/experience")({
  component: () => <CrudTable title="Experience" table="experience" orderBy={{ column: "display_order" }}
    fields={[
      { key: "title", label: "Job Title", required: true },
      { key: "company", label: "Company", required: true },
      { key: "period", label: "Period", placeholder: "2020 - Present" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "display_order", label: "Order", type: "number" },
    ]}
    listFields={["title", "company", "period"]}
  />,
});
