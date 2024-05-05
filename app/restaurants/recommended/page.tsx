import Header from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";
import { db } from "@/app/_lib/prisma";

const RecommendedRestaurants = async () => {
  const restaurants = await db.restaurant.findMany({});

  return (
    <>
      <Header />
      <div className="p-6 px-5">
        <h2 className="mb-6 text-lg font-semibold">
          Restaurantes Recomendados
        </h2>
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

export default RecommendedRestaurants;
