"use client";

import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "../_lib/utils";
import { toggleFavoriteRestaurant } from "../_actions/restaurant";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface RestaurantItemProps {
  restaurant: Restaurant;
  className?: string;
  userFavoriteRestaurants: UserFavoriteRestaurant[];
}

const RestaurantItem = ({
  restaurant,
  className,
  userFavoriteRestaurants,
}: RestaurantItemProps) => {
  const { data } = useSession();

  const isFavorite = userFavoriteRestaurants.some(
    (fav) => fav.restaurantId === restaurant.id,
  );

  const handleFavorites = async () => {
    if (!data?.user.id) return;

    try {
      await toggleFavoriteRestaurant(data?.user.id, restaurant.id);
      toast.success(
        isFavorite
          ? "Restaurante removido dos favoritos."
          : "Restaurante favoritado.",
      );
    } catch (error) {
      toast.error("Erro ao favoritar restaurante.");
    }
  };

  return (
    <div className={cn("min-w-[266px] max-w-[266px]", className)}>
      <div className="relative h-[150px] w-full overflow-hidden rounded-lg shadow-md">
        <Link href={`/restaurants/${restaurant.id}`}>
          <Image
            src={restaurant.imageUrl}
            fill
            alt={restaurant.name}
            className="object-cover"
          />
        </Link>
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary bg-white px-2 py-[2px]">
          <StarIcon
            size={16}
            className="fill-yellow-400 text-primary text-yellow-400"
          />
          <span className="text-xs font-semibold">5.0</span>
        </div>

        {data?.user.id && (
          <Button
            size="icon"
            className={`absolute right-2 top-2 h-7 w-7 rounded-full bg-gray-700 ${isFavorite && "bg-primary hover:bg-gray-700"}`}
            onClick={handleFavorites}
          >
            <HeartIcon size={16} className="fill-white" />
          </Button>
        )}
      </div>
      <Link href={`/restaurants/${restaurant.id}`}>
        <h2 className="truncate pt-3 text-sm font-semibold">
          {restaurant.name}
        </h2>
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
      </Link>
    </div>
  );
};

export default RestaurantItem;
