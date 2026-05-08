import { createFileRoute } from "@tanstack/react-router";
import { CrudTable } from "@/components/admin/CrudTable";

export const Route = createFileRoute("/admin/certifications")({
  component: () => <CrudTable title="Certifications" table="certifications" orderBy={{ column: "display_order" }}
    fields={[
      { key: "name", label: "Name", required: true },
      { key: "issuer", label: "Issuer" },
      { key: "year", label: "Year" },
      { key: "url", label: "URL" },
      { key: "display_order", label: "Order", type: "number" },
    ]}
    listFields={["name", "issuer", "year"]}
  />,
});
