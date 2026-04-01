import { CategoryCard } from "./category-card";

const categories = [
  {
    name: "Acuarios",
    description: "Tanques, kits y configuraciones completas",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=450&fit=crop",
    itemCount: 245,
  },
  {
    name: "Accesorios para Acuarios",
    description: "Filtros, motores, decoraciones",
    image: "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=600&h=450&fit=crop",
    itemCount: 520,
  },
  {
    name: "Perros",
    description: "Camas, comida, ropa y más",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=450&fit=crop",
    itemCount: 890,
  },
  {
    name: "Gatos",
    description: "Camas, comida y accesorios",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=450&fit=crop",
    itemCount: 650,
  },
  {
    name: "Hamsters",
    description: "Ruedas, jaulas, camas y comida",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&h=450&fit=crop",
    itemCount: 180,
  },
  {
    name: "Aves",
    description: "Jaulas, comida y accesorios",
    image: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=600&h=450&fit=crop",
    itemCount: 310,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl">
            Compra por Categoría
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            Encuentra todo lo que necesitas para tus queridas mascotas
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
