import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  description: string;
  image: string;
  itemCount: number;
}

export function CategoryCard({
  name,
  description,
  image,
  itemCount,
}: CategoryCardProps) {
  return (
    <a
      href={`/?category=${encodeURIComponent(name)}#productos`}
      className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-6">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base md:text-xl font-bold text-white truncate">{name}</h3>
            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs md:text-sm text-white/80 line-clamp-1">{description}</p>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-white/60">{itemCount} productos</p>
          </div>
          <div className="flex h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary-foreground" />
          </div>
        </div>
      </div>
    </a>
  );
}
