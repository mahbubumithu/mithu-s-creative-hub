import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/profile")({ component: ProfileAdmin });

function ProfileAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "profile"], queryFn: async () => {
    const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
    return data;
  }});
  const [form, setForm] = useState<Record<string, string>>({});
  const [social, setSocial] = useState({ linkedin: "", github: "", google: "", youtube: "" });

  useEffect(() => {
    if (data) {
      setForm({
        full_name: data.full_name || "", title: data.title || "", bio: data.bio || "",
        location: data.location || "", email: data.email || "", phone: data.phone || "",
        avatar_url: data.avatar_url || "", hero_image_url: data.hero_image_url || "", resume_url: data.resume_url || "",
      });
      setSocial({ ...{ linkedin: "", github: "", google: "", youtube: "" }, ...(data.social_links as Record<string,string> || {}) });
    }
  }, [data]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, social_links: social };
    const { error } = data?.id
      ? await supabase.from("profile").update(payload).eq("id", data.id)
      : await supabase.from("profile").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
    qc.invalidateQueries();
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      {[
        ["full_name", "Full Name"], ["title", "Title"], ["location", "Location"],
        ["email", "Email"], ["phone", "Phone"], ["avatar_url", "Avatar URL"],
        ["hero_image_url", "Hero Image URL"], ["resume_url", "Resume URL"],
      ].map(([k, l]) => (
        <div key={k} className="space-y-1.5">
          <Label>{l}</Label>
          <Input value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        </div>
      ))}
      <div className="space-y-1.5"><Label>Bio</Label><Textarea rows={4} value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
      <h2 className="pt-4 text-xl font-semibold">Social Links</h2>
      {(["linkedin","github","google","youtube"] as const).map((k) => (
        <div key={k} className="space-y-1.5">
          <Label className="capitalize">{k}</Label>
          <Input value={social[k]} onChange={(e) => setSocial({ ...social, [k]: e.target.value })} placeholder="https://" />
        </div>
      ))}
      <Button type="submit" className="bg-gradient-primary text-primary-foreground">Save</Button>
    </form>
  );
}
