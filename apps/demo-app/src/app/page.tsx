import Link from 'next/link';
import { formatCents } from '../shop/money.ts';
import { listProducts, type Product } from '../shop/products.ts';
import { shop } from './data.ts';

function extractQuery(searchParams: { q?: string }): string {
  const { q } = searchParams;
  return typeof q === 'string' ? q.trim() : '';
}

function productMatchesQuery(productName: string, query: string): boolean {
  if (query === '') {
    return true;
  }
  const lowerProductName = productName.toLowerCase();
  const lowerQuery = query.toLowerCase();
  return lowerProductName.includes(lowerQuery);
}

function filterProductsByQuery(products: Product[], query: string): Product[] {
  const filteredProducts: Product[] = [];
  for (const product of products) {
    if (productMatchesQuery(product.name, query)) {
      filteredProducts.push(product);
    }
  }
  return filteredProducts;
}

function renderProductList(products: Product[]): React.ReactElement[] {
  const productElements: React.ReactElement[] = [];
  for (const product of products) {
    productElements.push(
      <li key={product.id}>
        <Link href={`/products/${product.slug}`}>{product.name}</Link>
        <div>{formatCents(product.priceCents)}</div>
        {product.stock === 0 && <div>Sold out</div>}
      </li>
    );
  }
  return productElements;
}

export default async function HomePage(props: PageProps<'/'>) {
  const searchParams = await props.searchParams;
  const query = extractQuery(searchParams);
  const { db } = await shop();
  const allProducts = await listProducts(db);
  const products = filterProductsByQuery(allProducts, query);

  return (
    <main>
      <h1>Products</h1>
      <form>
        <input type="search" name="q" defaultValue={query} placeholder="Search" />
      </form>
      <ul className="products">
        {renderProductList(products)}
      </ul>
    </main>
  );
}
