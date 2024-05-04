"use client";

import DiscountBadge from "@/app/_components/discount-badge";
import ProductList from "@/app/_components/product-list";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import {
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  aditionalProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  aditionalProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () =>
    setQuantity((currentState) => currentState + 1);
  const handleDecreaseQuantity = () => {
    setQuantity((currentState) => {
      if (currentState === 1) return 1;

      return currentState - 1;
    });
  };

  return (
    <div className="relative z-20 -mt-6 rounded-tl-3xl rounded-tr-3xl bg-white pb-8">
      <div className="p-5">
        <div className="flex items-center gap-[0.375rem]">
          <div className="relative h-6 w-6">
            <Image
              src={product.restaurant.imageUrl}
              alt={product.restaurant.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {product.restaurant.name}
          </span>
        </div>
        <h1 className="mb-3 mt-1 text-xl font-semibold">{product.name}</h1>
        <div className="flex justify-between">
          <div>
            <div className="flex justify-between gap-2">
              <h2 className="text-xl font-semibold">
                {formatCurrency(calculateProductTotalPrice(product))}
              </h2>
              {product.discountPercentage > 0 && (
                <DiscountBadge product={product} />
              )}
            </div>
            {product.discountPercentage > 0 && (
              <p className="text-sm text-muted-foreground ">
                De: {formatCurrency(Number(product.price))}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 text-center">
            <Button
              className="rounded-md border font-semibold"
              size={"icon"}
              variant={"ghost"}
              onClick={handleDecreaseQuantity}
            >
              <ChevronLeftIcon size={18} />
            </Button>
            <span className="w-4 font-semibold">{quantity}</span>
            <Button
              className="rounded-md border font-semibold"
              size={"icon"}
              onClick={handleIncreaseQuantity}
            >
              <ChevronRightIcon size={18} />
            </Button>
          </div>
        </div>
        <Card className="mt-6 flex items-center justify-around py-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Entrega</span>
              <BikeIcon size={14} />
            </div>
            {Number(product.restaurant.deliveryFee) > 0 ? (
              <p className="text-xs font-semibold">
                {formatCurrency(Number(product.restaurant.deliveryFee))}
              </p>
            ) : (
              <p className="text-sm">Grátis</p>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Entrega</span>
              <TimerIcon size={14} />
            </div>
            <p className="text-xs font-semibold">
              {product.restaurant.deliveryTimeMinutes} min
            </p>
          </div>
        </Card>

        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">Sobre</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 pl-5">
        <ProductList title="Sucos" products={aditionalProducts} />
      </div>

      <div className="mt-6 px-5">
        <Button
          className="w-full font-semibold"
          size="lg"
          onClick={() => alert("Pedido realizado com sucesso!")}
        >
          Adicionar à sacola
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
