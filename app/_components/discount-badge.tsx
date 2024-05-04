import { Product } from "@prisma/client";
import { ArrowDownIcon } from "lucide-react";

interface DiscountBadgeProps {
  product: Pick<Product, "discountPercentage">;
}

const DiscountBadge = ({ product }: DiscountBadgeProps) => {
  return (
    <div className="flex items-center rounded-full bg-primary px-2 py-[2px] text-xs font-semibold text-white">
      <ArrowDownIcon size={12} />
      {product.discountPercentage}%
    </div>
  );
};

export default DiscountBadge;
