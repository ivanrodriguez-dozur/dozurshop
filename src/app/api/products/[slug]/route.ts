import { NextResponse } from 'next/server';

import { fetchProduct } from '../../../../lib/products';

export async function GET(_req, { params }) {
  const product = await fetchProduct(params.slug);
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}
