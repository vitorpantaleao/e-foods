"use client";

import { Restaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchForRestaurants } from "../_actions/search";
import Header from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";

const Restaurants = () => {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const query = searchParams.get("search");

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!query) return;
      const foundRestaurants = await searchForRestaurants(query);
      setRestaurants(foundRestaurants);
    };

    fetchRestaurants();
  }, [query, searchParams]);

  if (!query) {
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
              <RestaurantItem restaurant={restaurant} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Restaurants;
