import { Restaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";

interface RestaurantItemProps {
  restaurant: Restaurant;
}

const RestaurantItem = ({ restaurant }: RestaurantItemProps) => {
  return (
    <div className="min-w-[266px] max-w-[266px]">
      <div className="relative h-[150px] w-full overflow-hidden rounded-lg shadow-md">
        <Image
          src={restaurant.imageUrl}
          fill
          alt={restaurant.name}
          className="object-cover"
        />

        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary bg-white px-2 py-[2px]">
          <StarIcon
            size={16}
            className="fill-yellow-400 text-primary text-yellow-400"
          />
          <span className="text-xs font-semibold">5.0</span>
        </div>

        <Button
          variant={"ghost"}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-700 p-0"
        >
          <HeartIcon size={18} className="fill-white" />
        </Button>
      </div>
      <h2 className="truncate pt-3 text-sm font-semibold">{restaurant.name}</h2>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-[6px] text-sm text-muted-foreground">
          <BikeIcon size={16} className="text-primary" />
          {Number(restaurant.deliveryFee) == 0
            ? "Entrega Grátis "
            : formatCurrency(Number(restaurant.deliveryFee))}
        </span>
        <span className="flex items-center gap-[6px] text-sm text-muted-foreground">
          <TimerIcon size={16} className="text-primary" />
          {restaurant.deliveryTimeMinutes} min
        </span>
      </div>
    </div>
  );
};

export default RestaurantItem;
