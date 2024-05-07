import { useContext } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";

const Cart = () => {
  const { products, total, subTotal, totalDiscount } = useContext(CartContext);

  return (
    <div className="flex h-full flex-col py-5">
      {products.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-muted-foreground">Sua sacola está vazia</p>
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

          <Button className="mt-6 w-full">Finalizar Pedido</Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
