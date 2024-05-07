"use client";

import Cart from "@/app/_components/cart";
import { Button } from "@/app/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { CartContext } from "@/app/_context/cart";
import { formatCurrency } from "@/app/_helpers/price";
import { Restaurant } from "@prisma/client";
import { useContext } from "react";

interface FloatingCartProps {
  restaurant: Pick<Restaurant, "id">;
}

const FloatingCart = ({ restaurant }: FloatingCartProps) => {
  const { products, total, totalQuantity } = useContext(CartContext);

  const restaurantHasProductsOnCart = products.some(
    (product) => product.restaurantId === restaurant.id,
  );

  if (!restaurantHasProductsOnCart) {
    return null;
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 border-t border-solid border-[#f0f0f0] bg-white p-5 pt-3 shadow-md">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xs text-muted-foreground">Total sem entrega</h2>
          <h3 className="font-semibold">
            {formatCurrency(total)}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              / {totalQuantity} {totalQuantity > 1 ? "Itens" : "Item"}
            </span>
          </h3>
        </div>
        <Sheet>
          <SheetTrigger>
            <Button>Ver sacola</Button>
          </SheetTrigger>
          <SheetContent className="w-[90vw] bg-white">
            <SheetHeader>
              <SheetTitle className="text-left"> Sacola</SheetTitle>
            </SheetHeader>
            <Cart />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default FloatingCart;
