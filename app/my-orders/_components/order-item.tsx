"use client";

import { Avatar, AvatarImage } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Separator } from "@/app/_components/ui/separator";
import { CartContext } from "@/app/_context/cart";
import { formatCurrency } from "@/app/_helpers/price";
import { Order, OrderStatus, Prisma } from "@prisma/client";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

interface OrderItemProps {
  order: Prisma.OrderGetPayload<{
    include: {
      restaurant: true;
      products: {
        include: {
          product: true;
        };
      };
    };
  }>;
}

const getOrderStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "CONFIRMED":
      return "Confirmado";
    case "IN_PROGRESS":
      return "Em progresso";
    case "DELIVERING":
      return "Em entrega";
    case "DELIVERED":
      return "Entregue";
    case "CANCELED":
      return "Cancelado";
    case "REFUNDED":
      return "Reembolsado";
  }
};

const OrderItem = ({ order }: OrderItemProps) => {
  const { addProductToCart } = useContext(CartContext);

  const router = useRouter();

  const handleRedoOrder = () => {
    for (const orderProduct of order.products) {
      addProductToCart({
        product: { ...orderProduct.product, restaurant: order.restaurant },
        quantity: orderProduct.quantity,
      });
    }

    router.push(`/restaurants/${order.restaurantId}`);
  };

  return (
    <>
      <Card>
        <CardContent className="p-5">
          <div
            className={`w-fit rounded-full bg-[#EEEEEE] px-2 py-1 text-muted-foreground ${order.status !== "PENDING" && "bg-green-500 text-white"}`}
          >
            <span className="block text-xs font-semibold">
              {getOrderStatusLabel(order.status)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-2 ">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={order.restaurant.imageUrl}
                  alt={order.restaurant.name}
                />
              </Avatar>
              <span className="text-sm font-semibold">
                {order.restaurant.name}
              </span>
            </div>
            <Button variant={"link"} size={"icon"} className="h-6 w-6" asChild>
              <Link href={`/restaurants/${order.restaurant.id}`}>
                <ChevronRightIcon className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="py-3">
            <Separator className="bg-muted" />
          </div>

          <div className="space-y-1">
            {order.products.map((product) => (
              <div key={product.id}>
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground text-xs text-white">
                    {product.quantity}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {product.product.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="py-3">
            <Separator className="bg-muted" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-sm font-semibold">
              {formatCurrency(Number(order.total))}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 h-4 py-1 text-xs text-primary"
              disabled={order.status !== "DELIVERED"}
              onClick={handleRedoOrder}
            >
              Refazer Pedido
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OrderItem;
