import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({ component: Messages });

function Messages() {
  const qc = useQueryClient();
  const { data: msgs = [], isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
  };

  const markRead = async (id: string, is_read: boolean) => {
    await supabase.from("messages").update({ is_read: !is_read }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Messages</h1>
      <div className="mt-6 space-y-3">
        {isLoading ? <p className="text-muted-foreground">Loading…</p>
        : msgs.length === 0 ? <p className="text-muted-foreground">No messages yet.</p>
        : msgs.map((m) => (
          <div key={m.id} className={`rounded-2xl border p-5 ${m.is_read ? "border-border bg-card" : "border-primary/40 bg-card shadow-glow"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{m.name} <span className="text-muted-foreground font-normal">· {m.email}</span></p>
                {m.subject && <p className="text-sm text-primary">{m.subject}</p>}
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{m.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="ghost" onClick={() => markRead(m.id, m.is_read)} title="Toggle read"><Mail className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
