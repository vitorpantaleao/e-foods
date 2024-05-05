import Image from "next/image";
import { CartContext, CartProduct } from "./../_context/cart";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useContext } from "react";

interface CartItemProps {
  CartProduct: CartProduct;
}

const CartItem = ({ CartProduct }: CartItemProps) => {
  const {
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromCart,
  } = useContext(CartContext);

  const handleDecreaseProductQuantity = () => {
    decreaseProductQuantity(CartProduct.id);
  };

  const handleIncreaseProductQuantity = () => {
    increaseProductQuantity(CartProduct.id);
  };

  const handleRemoveProductFromCart = () => {
    removeProductFromCart(CartProduct.id);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative h-20 w-20">
          <Image
            src={CartProduct.imageUrl}
            alt={CartProduct.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs">{CartProduct.name}</h3>
          <div className="flex items-center gap-1">
            <h4 className="text-sm font-semibold">
              {formatCurrency(
                Number(calculateProductTotalPrice(CartProduct)) *
                  CartProduct.quantity,
              )}
            </h4>
            {CartProduct.discountPercentage > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(
                  Number(CartProduct.price) * CartProduct.quantity,
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-center">
            <Button
              className="h-8 w-8 rounded-md border font-semibold"
              size={"icon"}
              variant={"ghost"}
              onClick={handleDecreaseProductQuantity}
            >
              <ChevronLeftIcon size={18} />
            </Button>
            <span className="w-4 text-sm font-semibold">
              {CartProduct.quantity}
            </span>
            <Button
              className="h-8 w-8 rounded-md border font-semibold"
              size={"icon"}
              onClick={handleIncreaseProductQuantity}
            >
              <ChevronRightIcon size={18} />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Button
          className="h-8 w-8 rounded-md border font-semibold"
          size="icon"
          variant="ghost"
          onClick={handleRemoveProductFromCart}
        >
          <TrashIcon size={18} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
