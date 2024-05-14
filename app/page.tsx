import CategoryList from "./_components/category-list";
import Header from "./_components/header";
import Search from "./_components/search";
import ProductList from "./_components/product-list";
import { db } from "./_lib/prisma";
import PromoBanner from "./_components/promo-banner";
import RestaurantList from "./_components/restaurant-list";
import Link from "next/link";

const fetch = async () => {
  const getProducts = db.product.findMany({
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
  });

  const getBurguersCategory = db.category.findFirst({
    where: {
      name: "Hambúrgueres",
    },
  });

  const getPizzasCategory = db.category.findFirst({
    where: {
      name: "Pizzas",
    },
  });

  const [products, burguersCategory, pizzasCategory] = await Promise.all([
    getProducts,
    getBurguersCategory,
    getPizzasCategory,
  ]);

  return { products, burguersCategory, pizzasCategory };
};

const Home = async () => {
  const { products, burguersCategory, pizzasCategory } = await fetch();

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
        <Link href={`/categories/${pizzasCategory?.id}/products`}>
          <PromoBanner
            src={"/images/banner-promo.jpg"}
            alt="Banner Promocional 1"
          />
        </Link>
      </div>
      <div className="pl-5 pt-6">
        <ProductList
          title="Pedidos Recomendados"
          products={products}
          buttonLink={"/products/recommended"}
        />
      </div>
      <div className="px-5 pt-5">
        <Link href={`/categories/${burguersCategory?.id}/products`}>
          <PromoBanner
            src={"/images/mid-promo-banner.jpg"}
            alt="Banner Promocional 2"
          />
        </Link>
      </div>
      <div className="pl-5 pt-5">
        <RestaurantList title="Restaurantes Recomendados" />
      </div>
    </main>
  );
};

export default Home;
