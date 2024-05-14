"use client";

import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchForRestaurants } from "../_actions/search";
import Header from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";

interface RestaurantProps {
  userFavoriteRestaurants: UserFavoriteRestaurant[];
}

const Restaurants = ({ userFavoriteRestaurants }: RestaurantProps) => {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const searchFor = searchParams.get("search");

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!searchFor) return;
      const foundRestaurants = await searchForRestaurants(searchFor);
      setRestaurants(foundRestaurants);
    };

    fetchRestaurants();
  }, [searchFor]);

  if (!searchFor) {
    return notFound();
  }

  return (
    <>
      <Header />
      <div className="p-6 px-5">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Encontrados</h2>
        <div className="flex flex-col gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id}>
              <RestaurantItem
                restaurant={restaurant}
                userFavoriteRestaurants={userFavoriteRestaurants}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Restaurants;
