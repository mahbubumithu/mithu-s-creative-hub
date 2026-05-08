import { supabase } from "@/integrations/supabase/client";

export const fetchProfile = async () => {
  const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
  return data;
};
export const fetchSkills = async () => {
  const { data } = await supabase.from("skills").select("*").order("display_order");
  return data ?? [];
};
export const fetchTools = async () => {
  const { data } = await supabase.from("tools").select("*").order("display_order");
  return data ?? [];
};
export const fetchEducation = async () => {
  const { data } = await supabase.from("education").select("*").order("display_order");
  return data ?? [];
};
export const fetchExperience = async () => {
  const { data } = await supabase.from("experience").select("*").order("display_order");
  return data ?? [];
};
export const fetchCertifications = async () => {
  const { data } = await supabase.from("certifications").select("*").order("display_order");
  return data ?? [];
};
export const fetchServices = async () => {
  const { data } = await supabase.from("services").select("*").order("display_order");
  return data ?? [];
};
export const fetchProjects = async () => {
  const { data } = await supabase.from("projects").select("*").order("display_order");
  return data ?? [];
};
export const fetchTestimonials = async () => {
  const { data } = await supabase.from("testimonials").select("*").order("display_order");
  return data ?? [];
};
export const fetchBlogPosts = async (publishedOnly = true) => {
  let q = supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (publishedOnly) q = q.eq("published", true);
  const { data } = await q;
  return data ?? [];
};
