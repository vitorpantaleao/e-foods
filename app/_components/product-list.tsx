import { ChevronRight } from "lucide-react";
import { db } from "../_lib/prisma";
import ProductItem from "./product-item";
import { Button } from "./ui/button";
import { Prisma } from "@prisma/client";

interface ProductListProps {
  title?: string;
  products: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
        };
      };
    };
  }>[];
}

const ProductList = async ({ title, products }: ProductListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {title ? <h2 className="font-semibold"> {title} </h2> : ""}
        <Button variant={"ghost"} className="h-0 p-0 pr-5 text-primary">
          Ver todos
          <ChevronRight size={16} />
        </Button>
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
