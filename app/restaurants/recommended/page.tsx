import Header from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";
import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";

const RecommendedRestaurants = async () => {
  const restaurants = await db.restaurant.findMany({});
  const session = await getServerSession(authOptions);
  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      restaurant: true,
    },
  });

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
              <RestaurantItem
                className="min-w-full max-w-full"
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

export default RecommendedRestaurants;
