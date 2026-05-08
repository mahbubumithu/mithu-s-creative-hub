import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchProfile } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MD Mahbub Uddin" },
      { name: "description", content: "Get in touch for collaborations or consultations." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Invalid email").max(320),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

function Contact() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("messages").insert(parsed.data);
    setLoading(false);
    if (error) { toast.error("Failed to send. Please try again."); return; }
    toast.success("Message sent! I'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Get in touch</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Let's talk</h1>
          <p className="mt-4 text-muted-foreground">I'm always open to discussing new projects, ideas or opportunities.</p>
          <div className="mt-8 space-y-4">
            {profile?.email && (
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /><a href={`mailto:${profile.email}`} className="hover:text-primary">{profile.email}</a></div>
            )}
            {profile?.location && (
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><span>{profile.location}</span></div>
            )}
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={200} />
          <Input type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={320} />
          <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={200} />
          <Textarea placeholder="Your message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={5000} />
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            {loading ? "Sending…" : (<>Send Message <Send className="ml-1 h-4 w-4" /></>)}
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}
