import CategoryList from "./_components/category-list";
import Header from "./_components/header";
import Search from "./_components/search";
import ProductList from "./_components/product-list";
import { db } from "./_lib/prisma";
import PromoBanner from "./_components/promo-banner";
import RestaurantList from "./_components/restaurant-list";

const Home = async () => {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 10,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      discountPercentage: "desc",
    },
  });

  return (
    <main className="pb-6">
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>
      <div className="pl-5 pt-6">
        <CategoryList />
      </div>
      <div className="px-5 pt-5">
        <PromoBanner
          src={"/images/banner-promo.jpg"}
          alt="Banner Promocional 1"
        />
      </div>
      <div className="pl-5 pt-6">
        <ProductList
          title="Pedidos Recomendados"
          products={products}
          buttonLink={"/products/recommended"}
        />
      </div>
      <div className="px-5 pt-5">
        <PromoBanner
          src={"/images/mid-promo-banner.jpg"}
          alt="Banner Promocional 2"
        />
      </div>
      <div className="pl-5 pt-5">
        <RestaurantList title="Restaurantes Recomendados" />
      </div>
    </main>
  );
};

export default Home;
