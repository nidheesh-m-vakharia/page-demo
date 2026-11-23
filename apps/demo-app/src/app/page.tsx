import Link from 'next/link';
import { formatCents } from '../shop/money.ts';
import { listProducts } from '../shop/products.ts';
import { shop } from './data.ts';

export default async function HomePage(props: PageProps<'/'>) {
  const { q } = await props.searchParams;
  const query = typeof q === 'string' ? q.trim() : '';
  const { db } = await shop();
  const all = await listProducts(db);
  const products = query ? all.filter((p) => new RegExp(query, 'i').test(p.name)) : all;

  return (
    <main>
      <h1>Products</h1>
      <form>
        <input type="search" name="q" defaultValue={query} placeholder="Search" />
      </form>
      <ul className="products">
        {products.map((p) => (
          <li key={p.id}>
            <Link href={`/products/${p.slug}`}>{p.name}</Link>
            <div>{formatCents(p.priceCents)}</div>
            {p.stock === 0 && <div>Sold out</div>}
          </li>
        ))}
      </ul>
    </main>
  );
}
