// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

serve(async (req) => {
  const supabaseUrl = (typeof Deno !== "undefined" && Deno.env && Deno.env.get)
    ? Deno.env.get("SUPABASE_URL")
    : (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined);

  const supabaseAnonKey = (typeof Deno !== "undefined" && Deno.env && Deno.env.get)
    ? Deno.env.get("SUPABASE_ANON_KEY")
    : (typeof process !== "undefined" ? process.env.SUPABASE_ANON_KEY : undefined);

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase credentials" }), { status: 500 });
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
  );

  // Traer los booms del feed
  const { data: booms, error } = await supabase
    .from("booms_feed")
    .select("*");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Calcular score
  const ranked = (booms || []).map((b: any) => {
    const globalScore =
      (b.likes_count || 0) * 3 +
      (b.comments_count || 0) * 4 +
      (b.saves_count || 0) * 5 +
      (b.shares_count || 0) * 6 +
      (b.views_count || 0) * 1;

    return { ...b, score: globalScore };
  });

  // Ordenar de mayor a menor
  ranked.sort((a: any, b: any) => b.score - a.score);

  return new Response(JSON.stringify(ranked), {
    headers: { "Content-Type": "application/json" },
  });
});
