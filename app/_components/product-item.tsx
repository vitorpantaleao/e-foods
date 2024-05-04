import { Prisma, Product } from "@prisma/client";
import Image from "next/image";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "./../_helpers/price";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";

interface ProductItemProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
        };
      };
    };
  }>;
}

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="w-[150px] min-w-[150px] space-y-2">
        <div className="relative h-[150px] w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={product.imageUrl}
            fill
            alt={product.name}
            className="object-cover"
          />

          {product.discountPercentage > 0 && (
            <div className="absolute left-2 top-2 flex items-center rounded-full bg-primary px-2 py-[2px] text-xs font-semibold text-white">
              <ArrowDownIcon size={12} />
              {product.discountPercentage}%
            </div>
          )}
        </div>
        <div>
          <h2 className="truncate text-sm">{product.name}</h2>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">
              {formatCurrency(calculateProductTotalPrice(product))}
            </h3>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(Number(product.price))}
              </span>
            )}
          </div>
          <span className="-mt-[2px] block truncate text-sm text-muted-foreground">
            {product.restaurant.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
