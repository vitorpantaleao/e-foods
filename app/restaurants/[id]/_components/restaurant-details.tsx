"use client";

import DeliveryInfo from "@/app/_components/delivery-info";
import ProductList from "@/app/_components/product-list";
import { Category, Product, Restaurant } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";

interface RestaurantDetailsProps {
  restaurant: Restaurant & {
    categories: Category[] &
      {
        products: Product[];
      }[];
  };
}

const RestaurantDetails = ({ restaurant }: RestaurantDetailsProps) => {
  return (
    <div className="relative z-20 -mt-6 rounded-tl-3xl rounded-tr-3xl bg-white pb-8">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.375rem]">
            <div className="relative h-6 w-6">
              <Image
                src={restaurant.imageUrl}
                alt={restaurant.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h1 className="text-xl font-semibold"> {restaurant.name} </h1>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-foreground p-2 text-white">
            <StarIcon
              size={16}
              className="fill-yellow-400 text-primary text-yellow-400"
            />
            <span className="text-xs font-semibold">5.0</span>
          </div>
        </div>

        <DeliveryInfo restaurant={restaurant} />
      </div>

      <div className="scrollbar-hide mt-3 flex gap-4 overflow-x-scroll px-5 [&::-webkit-scrollbar]:hidden">
        {restaurant.categories.map((category) => (
          <div
            key={category.name}
            className="min-w-[160px] rounded-lg bg-[#F4F4F4] py-1 text-center font-semibold"
          >
            <span className="text-xs text-muted-foreground">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 px-5">
        {/* <ProductList title="Mais Pedidos" products={products.map(product => ({ ...product, restaurant }))} /> */}
        <ProductList
          title="Mais Pedidos"
          products={restaurant.categories[0].products.map((product) => ({
            ...product,
            restaurant,
          }))}
        />

        {/* {restaurant.categories.map((category) => (
                    <div className="mt-6" key={category.name}>
                        <ProductList
                            title={category.name}
                            products={category.products.map(product => ({ ...product, restaurant }))}
                        />  
                    </div>
                ))} */}
      </div>
    </div>
  );
};

export default RestaurantDetails;
