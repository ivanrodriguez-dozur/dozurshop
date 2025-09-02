import { supabase } from "./supabaseClient";

export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    console.error("Error cargando productos:", error);
    return [];
  }
  return data;
}
