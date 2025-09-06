import { supabase } from '@/lib/supabaseClient';

export async function fetchProducts() {
	const { data, error } = await supabase.from('products').select('*');
	if (error) throw error;
	return data;
}

export async function fetchProduct(slug: string) {
	const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
	if (error) throw error;
	return data;
}
