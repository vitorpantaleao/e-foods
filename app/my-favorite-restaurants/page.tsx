import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { notFound } from "next/navigation";
import Header from "../_components/header";
import RestaurantItem from "../_components/restaurant-item";

const MyFavoriteRestaurantsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return notFound();

  const restaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      restaurant: true,
    },
  });

  return (
    <>
      <Header />
      <div className="p-6 px-5">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Favoritos</h2>
        <div className="flex flex-col gap-6">
          {restaurants.length > 0 ? (
            restaurants.map(({ restaurant }) => (
              <RestaurantItem
                key={restaurant.id}
                restaurant={restaurant}
                className="min-w-full max-w-full"
                userFavoriteRestaurants={restaurants}
              />
            ))
          ) : (
            <h3 className="text-center">Nenhum restaurante favorito.</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default MyFavoriteRestaurantsPage;
