import { ChevronRight } from "lucide-react";
import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";
import { Button } from "./ui/button";
import Link from "next/link";

interface RestaurantListProps {
  title?: string;
}

const RestaurantList = async ({ title }: RestaurantListProps) => {
  const restaurants = await db.restaurant.findMany({
    take: 10,
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
          <RestaurantItem key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
