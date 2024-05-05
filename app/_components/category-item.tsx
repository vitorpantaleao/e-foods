import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface CategoryItemProps {
  category: Category;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  return (
    <Link href={`/categories/${category.id}/products`}>
      <div className="flex h-[54px] w-max items-center gap-3 rounded-full bg-white px-4 py-3 shadow-md">
        <Image
          src={category.imageUrl}
          width={30}
          height={30}
          alt={category.name}
        />
        <span className="text-sm font-semibold">{category.name}</span>
      </div>
    </Link>
  );
};

export default CategoryItem;
