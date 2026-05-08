import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase as supabaseTyped } from "@/integrations/supabase/client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = supabaseTyped as any;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export type FieldType = "text" | "textarea" | "number" | "image" | "url" | "switch" | "tags";
export interface FieldDef { key: string; label: string; type?: FieldType; required?: boolean; placeholder?: string; }

interface Props {
  title: string;
  table: string;
  fields: FieldDef[];
  listFields?: string[];
  orderBy?: { column: string; ascending?: boolean };
}

export function CrudTable({ title, table, fields, listFields, orderBy }: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      let q = supabase.from(table).select("*");
      if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", table] });

  const save = async (values: Record<string, unknown>) => {
    const payload = { ...values };
    fields.forEach((f) => {
      if (f.type === "number") payload[f.key] = Number(payload[f.key] || 0);
      if (f.type === "tags" && typeof payload[f.key] === "string") {
        payload[f.key] = (payload[f.key] as string).split(",").map((s) => s.trim()).filter(Boolean);
      }
    });
    const { error } = editing?.id
      ? await supabase.from(table).update(payload).eq("id", editing.id as string)
      : await supabase.from(table).insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    setOpen(false); setEditing(null); refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted"); refresh();
  };

  const cols = listFields ?? fields.slice(0, 3).map((f) => f.key);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({})} className="bg-gradient-primary text-primary-foreground">
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Add"} {title}</DialogTitle></DialogHeader>
            <CrudForm fields={fields} initial={editing ?? {}} onSubmit={save} onCancel={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>{cols.map((c) => <th key={c} className="p-3 font-medium">{c}</th>)}<th className="p-3 w-32" /></tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={cols.length + 1} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={cols.length + 1} className="p-6 text-center text-muted-foreground">No items yet</td></tr>
            ) : (rows as Array<Record<string, unknown>>).map((r) => (
              <tr key={r.id as string} className="border-t border-border">
                {cols.map((c) => (
                  <td key={c} className="p-3 align-top max-w-xs truncate">
                    {renderCell((r as Record<string, unknown>)[c])}
                  </td>
                ))}
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(r.id as string)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function renderCell(v: unknown): React.ReactNode {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "✓" : "—";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  const str = String(v);
  if (/^https?:\/\/.+\.(png|jpg|jpeg|svg|webp|gif)/i.test(str)) {
    return <img src={str} alt="" className="h-8 w-8 object-contain" />;
  }
  return str.length > 80 ? str.slice(0, 80) + "…" : str;
}

function CrudForm({ fields, initial, onSubmit, onCancel }: { fields: FieldDef[]; initial: Record<string, unknown>; onSubmit: (v: Record<string, unknown>) => void; onCancel: () => void }) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const v: Record<string, unknown> = {};
    fields.forEach((f) => {
      const initVal = initial[f.key];
      if (f.type === "tags" && Array.isArray(initVal)) v[f.key] = (initVal as string[]).join(", ");
      else v[f.key] = initVal ?? (f.type === "switch" ? false : f.type === "number" ? 0 : "");
    });
    return v;
  });

  const set = (k: string, v: unknown) => setValues((s) => ({ ...s, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(values); }} className="space-y-4">
      {fields.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label>{f.label}{f.required && " *"}</Label>
          {f.type === "textarea" ? (
            <Textarea rows={5} value={values[f.key] as string} onChange={(e) => set(f.key, e.target.value)} required={f.required} placeholder={f.placeholder} />
          ) : f.type === "switch" ? (
            <Switch checked={!!values[f.key]} onCheckedChange={(c) => set(f.key, c)} />
          ) : (
            <Input
              type={f.type === "number" ? "number" : "text"}
              value={values[f.key] as string}
              onChange={(e) => set(f.key, e.target.value)}
              required={f.required}
              placeholder={f.placeholder}
            />
          )}
          {f.type === "image" && !!values[f.key] && <img src={String(values[f.key])} alt="" className="mt-2 h-16 w-16 object-contain rounded" />}
        </div>
      ))}
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-gradient-primary text-primary-foreground">Save</Button>
      </DialogFooter>
    </form>
  );
}
