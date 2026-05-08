import { createFileRoute, useNavigate, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, User, Code2, Wrench, GraduationCap, Briefcase,
  Award, Sparkles, FolderKanban, MessageSquare, Quote, FileText, LogOut
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const sections = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/skills", label: "Skills", icon: Code2 },
  { to: "/admin/tools", label: "Tools", icon: Wrench },
  { to: "/admin/education", label: "Education", icon: GraduationCap },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/certifications", label: "Certifications", icon: Award },
  { to: "/admin/services", label: "Services", icon: Sparkles },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
];

function AdminLayout() {
  const nav = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) nav({ to: "/admin/login" });
  }, [loading, session, isAdmin, nav]);

  if (loading || !session || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const logout = async () => { await supabase.auth.signOut(); nav({ to: "/admin/login" }); };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border p-6">
          <Link to="/" className="font-display text-lg font-bold">
            <span className="text-gradient">Mahbub</span> Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sections.map((s) => {
            const active = s.exact ? path === s.to : path.startsWith(s.to);
            return (
              <Link key={s.to} to={s.to} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                <s.icon className="h-4 w-4" /> {s.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Button variant="ghost" onClick={logout} className="w-full justify-start text-muted-foreground"><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="md:hidden border-b border-border bg-card p-4 flex gap-2 overflow-x-auto">
          {sections.map((s) => (
            <Link key={s.to} to={s.to} className="whitespace-nowrap rounded-md bg-secondary px-3 py-1.5 text-xs">{s.label}</Link>
          ))}
        </div>
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
