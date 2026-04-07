import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/woocommerce/api";
import { SearchQuerySchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const parsed = q ? SearchQuerySchema.safeParse(q) : null;

  if (!parsed?.success) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await searchProducts(parsed.data);
    return NextResponse.json({ products: products.slice(0, 6) });
  } catch {
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
