import { ProductForm } from '@/components/admin/ProductForm';
import { CollectionForm } from '@/components/admin/CollectionForm';

export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-3">Create Product</h2>
        <ProductForm />
      </section>
      <hr />
      <section>
        <h2 className="text-xl font-semibold mb-3">Create Collection</h2>
        <CollectionForm />
      </section>
    </div>
  );
}


