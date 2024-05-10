import { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import { createOrder } from "../_actions/order";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const Cart = () => {
  const { products, total, subTotal, totalDiscount, clearCart } =
    useContext(CartContext);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  const { data } = useSession();

  const handleFinishOrder = async () => {
    if (!data?.user) return;

    const restaurant = products?.[0]?.restaurant;

    try {
      setIsSubmitLoading(true);

      await createOrder({
        subTotal,
        total,
        totalDiscount,
        deliveryFee: restaurant?.deliveryFee,
        deliveryTimeMinutes: restaurant?.deliveryTimeMinutes,
        restaurant: {
          connect: {
            id: restaurant?.id,
          },
        },
        status: OrderStatus.PENDING,
        user: {
          connect: {
            id: data.user.id,
          },
        },
        products: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });

      clearCart();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col py-5">
        {products.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-lg text-muted-foreground">
              Sua sacola está vazia
            </p>
          </div>
        ) : (
          <div className="flex-1 space-y-5 overflow-y-auto">
            {products.map((product) => (
              <CartItem key={product.id} CartProduct={product} />
            ))}
          </div>
        )}

        {products.length !== 0 && (
          <div className="mt-6">
            <Card>
              <CardContent className="space-y-3 divide-y p-5">
                <div className="flex items-center justify-between pt-3 text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <div>{formatCurrency(subTotal)}</div>
                </div>
                <div className="flex items-center justify-between pt-3 text-xs">
                  <span className="text-muted-foreground">Descontos</span>
                  <div>- {formatCurrency(totalDiscount)}</div>
                </div>
                <div className="flex items-center justify-between pt-3 text-xs">
                  <span className="text-muted-foreground">Entrega</span>
                  <div>
                    {Number(products?.[0]?.restaurant?.deliveryFee) === 0 ? (
                      <span className="uppercase text-primary">Grátis</span>
                    ) : (
                      formatCurrency(
                        Number(products?.[0]?.restaurant?.deliveryFee),
                      )
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 text-sm font-semibold">
                  <span className="text-muted-foreground">Total</span>
                  <div>{formatCurrency(total)}</div>
                </div>
              </CardContent>
            </Card>

            <Button
              className="mt-6 w-full"
              onClick={() => setIsConfirmationDialogOpen(true)}
              disabled={isSubmitLoading}
            >
              Finalizar Pedido
            </Button>
          </div>
        )}
      </div>

      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <AlertDialogContent className="w-4/5">
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja finalizar o pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao finalizar o pedido, você concorda com os termos de uso e a
              política de privacidade do aplicativo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitLoading}>
              {isSubmitLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishOrder}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Cart;
