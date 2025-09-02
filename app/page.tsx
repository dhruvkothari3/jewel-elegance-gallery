async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

type Product = { id: string; name: string; description: string | null; images: string[] };
type Collection = { id: string; name: string; description: string | null; banner_image: string | null };

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    fetchJson<Product[]>('/api/products').catch(() => []),
    fetchJson<Collection[]>('/api/collections').catch(() => []),
  ]);

  // Sample content that always shows, merged with DB content
  const sampleProducts: Product[] = [
    {
      id: 'sample-p-1',
      name: 'Radiant Diamond Ring',
      description: 'Brilliant-cut diamond set in white gold.',
      images: ['https://images.unsplash.com/photo-1516637090014-cb1ab0d08fc7?q=80&w=800&auto=format&fit=crop']
    },
    {
      id: 'sample-p-2',
      name: 'Classic Gold Necklace',
      description: 'Timeless 18k gold chain crafted to perfection.',
      images: ['https://images.unsplash.com/photo-1523292562811-8fa7962a78c8?q=80&w=800&auto=format&fit=crop']
    },
    {
      id: 'sample-p-3',
      name: 'Emerald Earrings',
      description: 'Elegant emerald studs for every occasion.',
      images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476b?q=80&w=800&auto=format&fit=crop']
    }
  ];

  const sampleCollections: Collection[] = [
    {
      id: 'sample-c-1',
      name: 'Bridal Collection',
      description: 'Curated pieces for your big day.',
      banner_image: 'https://images.unsplash.com/photo-1519224069048-0d58e2a4b6bf?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'sample-c-2',
      name: 'Everyday Essentials',
      description: 'Minimal designs for daily wear.',
      banner_image: 'https://images.unsplash.com/photo-1556229174-5f1e0c6c8f18?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  const mergedProducts = [...sampleProducts, ...products];
  const mergedCollections = [...sampleCollections, ...collections];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mergedProducts.map((p) => (
            <div key={p.id} className="border rounded p-4">
              <h3 className="font-semibold text-lg">{p.name}</h3>
              {p.description && <p className="text-sm text-gray-600 mb-2">{p.description}</p>}
              <div className="grid grid-cols-3 gap-2">
                {(p.images || []).map((url, i) => (
                  <img key={i} src={url} alt={p.name} className="w-full h-24 object-cover rounded" />
                ))}
              </div>
            </div>
          ))}
          {mergedProducts.length === 0 && <p className="text-gray-600">No products yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mergedCollections.map((c) => (
            <div key={c.id} className="border rounded p-4">
              <h3 className="font-semibold text-lg">{c.name}</h3>
              {c.description && <p className="text-sm text-gray-600 mb-2">{c.description}</p>}
              {c.banner_image && (
                <img src={c.banner_image} alt={c.name} className="w-full h-40 object-cover rounded" />
              )}
            </div>
          ))}
          {mergedCollections.length === 0 && <p className="text-gray-600">No collections yet.</p>}
        </div>
      </section>
    </div>
  );
}


