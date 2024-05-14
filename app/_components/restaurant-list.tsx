import { ChevronRight } from "lucide-react";
import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";
import { Button } from "./ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

interface RestaurantListProps {
  title?: string;
}

const RestaurantList = async ({ title }: RestaurantListProps) => {
  const session = await getServerSession(authOptions);

  const restaurants = await db.restaurant.findMany({
    take: 10,
  });
  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {title ? <h2 className="font-semibold"> {title} </h2> : ""}
        <Link href="/restaurants/recommended">
          <Button variant={"ghost"} className="h-0 p-0 pr-5 text-primary">
            Ver todos
            <ChevronRight size={16} />
          </Button>
        </Link>
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
        {restaurants.map((restaurant) => (
          <RestaurantItem
            key={restaurant.id}
            restaurant={restaurant}
            userId={session?.user?.id}
            userFavoriteRestaurants={userFavoriteRestaurants}
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
