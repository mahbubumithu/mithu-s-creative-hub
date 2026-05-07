import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/lib/queries";
import { Github, Linkedin, Youtube, Mail, Globe } from "lucide-react";

export function Footer() {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const social = (profile?.social_links as Record<string, string>) ?? {};
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile?.full_name || "MD MAHBUB UDDIN"}. All rights reserved.
        </p>
        <div className="flex items-center gap-3 text-muted-foreground">
          {social.linkedin && <a href={social.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary"><Linkedin className="h-5 w-5" /></a>}
          {social.github && <a href={social.github} target="_blank" rel="noreferrer" className="hover:text-primary"><Github className="h-5 w-5" /></a>}
          {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer" className="hover:text-primary"><Youtube className="h-5 w-5" /></a>}
          {social.google && <a href={social.google} target="_blank" rel="noreferrer" className="hover:text-primary"><Globe className="h-5 w-5" /></a>}
          {profile?.email && <a href={`mailto:${profile.email}`} className="hover:text-primary"><Mail className="h-5 w-5" /></a>}
        </div>
      </div>
    </footer>
  );
}
