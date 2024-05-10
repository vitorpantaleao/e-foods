"use client";

import Cart from "@/app/_components/cart";
import DeliveryInfo from "@/app/_components/delivery-info";
import DiscountBadge from "@/app/_components/discount-badge";
import ProductList from "@/app/_components/product-list";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { CartContext } from "@/app/_context/cart";
import {
  calculateProductTotalPrice,
  formatCurrency,
} from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addProductToCart, products } = useContext(CartContext);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  const addToCart = ({ emptyCart }: { emptyCart?: boolean }) => {
    addProductToCart({ product, quantity, emptyCart });
    setIsCartOpen(true);
  };

  const handleAddProductToCart = () => {
    const hasDifferentRestaurantProduct = products.some(
      (cartProduct) => cartProduct.restaurantId !== product.restaurantId,
    );

    if (hasDifferentRestaurantProduct) {
      setIsConfirmationDialogOpen(true);
      return;
    }

    addToCart({
      emptyCart: false,
    });
  };

  const handleIncreaseQuantity = () =>
    setQuantity((currentState) => currentState + 1);
  const handleDecreaseQuantity = () => {
    setQuantity((currentState) => {
      if (currentState === 1) return 1;

      return currentState - 1;
    });
  };

  return (
    <>
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

          <DeliveryInfo restaurant={product.restaurant} />

          <div className="mt-6 space-y-3">
            <h3 className="font-semibold">Sobre</h3>
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 pl-5">
          <ProductList
            title="Sucos"
            products={aditionalProducts}
            buttonLink={
              "/categories/cf96a91e-f664-42c5-8067-59bc20ee3aa0/products"
            }
          />
        </div>

        <div className="mt-6 px-5">
          <Button
            className="w-full font-semibold"
            size="lg"
            onClick={handleAddProductToCart}
          >
            Adicionar à sacola
          </Button>
        </div>
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-[90vw] bg-white">
          <SheetHeader>
            <SheetTitle className="text-left"> Sacola</SheetTitle>
          </SheetHeader>
          <Cart setIsCartOpen={setIsCartOpen} />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <AlertDialogContent className="w-4/5">
          <AlertDialogHeader>
            <AlertDialogTitle className="leading-5">
              Você só pode adicionar itens de um restaurante por vez!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Deseja limpar a sacola atual e adicionar o novo produto?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => addToCart({ emptyCart: true })}>
              Esvaziar sacola e adicionar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDetails;
