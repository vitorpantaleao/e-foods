import { db } from "../_lib/prisma";
import CategoryItem from "./category-item";

const CategoryList = async () => {
  const categories = await db.category.findMany({});

  return (
    <div className="scrollbar-hide flex h-[64px] gap-3 overflow-x-scroll">
      {categories.map((category) => (
        <div key={category.id}>
          <CategoryItem category={category} />
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
