import Image from "next/image";
import CategoryList from "./_components/category-list";
import Header from "./_components/header";
import Search from "./_components/search";
import ProductList from "./_components/product-list";
import { db } from "./_lib/prisma";

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
    <main>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>
      <div className="pl-5 pt-6">
        <CategoryList />
      </div>
      <div className="px-5 pt-5">
        <Image
          src="/images/banner-promo.jpg"
          width={0}
          height={0}
          className="h-auto w-full object-contain"
          sizes="100vw"
          quality={100}
          alt="Banner Promocional"
        />
      </div>
      <div className="pl-5 pt-6">
        <ProductList title="Pedidos Recomendados" products={products} />
      </div>
    </main>
  );
};

export default Home;
