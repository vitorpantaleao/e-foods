"use client";

import { Prisma } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          id: true;
          deliveryFee: true;
          deliveryTimeMinutes: true;
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
  totalQuantity: number;
  addProductToCart: ({
    product,
    quantity,
    emptyCart,
  }: {
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            id: true;
            deliveryFee: true;
            deliveryTimeMinutes: true;
          };
        };
      };
    }>;
    quantity: Number;
    emptyCart?: boolean;
  }) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<ICartContext>({
  products: [],
  subTotal: 0,
  total: 0,
  totalDiscount: 0,
  totalQuantity: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subTotal = products.reduce((acc, product) => {
    return acc + Number(product.price) * product.quantity;
  }, 0);

  const total =
    products.reduce((acc, product) => {
      return acc + calculateProductTotalPrice(product) * product.quantity;
    }, 0) + Number(products?.[0]?.restaurant?.deliveryFee);

  const totalDiscount =
    subTotal - total + Number(products?.[0]?.restaurant?.deliveryFee);

  const totalQuantity = products.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);

  const clearCart = () => {
    return setProducts([]);
  };

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

  const addProductToCart = ({
    product,
    quantity,
    emptyCart,
  }: {
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            id: true;
            deliveryFee: true;
            deliveryTimeMinutes: true;
          };
        };
      };
    }>;
    quantity: Number;
    emptyCart?: boolean;
  }) => {
    // Verifica se o produto adicionado é de um restaurante diferente e limpa o carrinho
    if (emptyCart) {
      setProducts([]);
    }

    // verifica se o produto já está no carrinho
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

  return (
    <CartContext.Provider
      value={{
        products,
        subTotal,
        total,
        totalDiscount,
        totalQuantity,
        clearCart,
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
