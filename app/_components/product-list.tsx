"use client";

import { ChevronRight } from "lucide-react";
import ProductItem from "./product-item";
import { Button } from "./ui/button";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  buttonLink?: string | any;
}

const ProductList = ({ title, products, buttonLink }: ProductListProps) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {title ? <h2 className="font-semibold"> {title} </h2> : ""}
        {/* <Link href={buttonLink}> */}
        <Button
          variant={"ghost"}
          className="h-0 p-0 pr-5 text-primary"
          onClick={() => {
            router.push(buttonLink);
          }}
        >
          Ver todos
          <ChevronRight size={16} />
        </Button>
        {/* </Link> */}
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-scroll pr-5 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
