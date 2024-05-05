"use client";

import { Prisma, Product } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          deliveryFee: true;
        };
      };
    };
  }> {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  subTotal: number;
  total: number;
  totalDiscount: number;
  addProductToCart: (
    product: Prisma.ProductGetPayload<{
      include: { restaurant: { select: { deliveryFee: true } } };
    }>,
    quantity: number,
  ) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subTotal: 0,
  total: 0,
  totalDiscount: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const decreaseProductQuantity = (productId: string) => {
    return setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          if (cartProduct.quantity === 1) {
            return cartProduct;
          }
          return {
            ...cartProduct,
            quantity: cartProduct.quantity - 1,
          };
        }

        return cartProduct;
      }),
    );
  };

  const increaseProductQuantity = (productId: string) => {
    return setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
          };
        }

        return cartProduct;
      }),
    );
  };

  const removeProductFromCart = (productId: string) => {
    return setProducts((prev) =>
      prev.filter((cartProduct) => cartProduct.id !== productId),
    );
  };

  const addProductToCart = (
    product: Prisma.ProductGetPayload<{
      include: { restaurant: { select: { deliveryFee: true } } };
    }>,
    quantity: Number,
  ) => {
    const isProductInCart = products.some((p) => p.id === product.id);

    // Se o produto já estiver no carrinho, incrementa a quantidade
    if (isProductInCart) {
      return setProducts((prev) =>
        prev.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + Number(quantity),
            };
          }

          return cartProduct;
        }),
      );
    }

    // Se o produto não estiver no carrinho, adiciona o produto com quantidade recebida
    setProducts((prev) => [
      ...prev,
      { ...product, quantity: Number(quantity) },
    ]);
  };

  const subTotal = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
  }, [products]);

  const total = useMemo(() => {
    return products.reduce((acc, product) => {
      return (
        acc + Number(calculateProductTotalPrice(product)) * product.quantity
      );
    }, 0);
  }, [products]);

  const totalDiscount = subTotal - total;

  return (
    <CartContext.Provider
      value={{
        products,
        subTotal,
        total,
        totalDiscount,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
