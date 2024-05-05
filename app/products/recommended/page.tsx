import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";

const RecommendedProductsPage = async () => {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 20,
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

  // TODO: Pegar os produtos com mais pedidos
  return (
    <>
      <Header />
      <div className="p-6 px-5">
        <h2 className="mb-6 text-lg font-semibold"> Pedidos Recomendados </h2>
        <div className="grid grid-cols-2 gap-6">
          {products.map((product) => (
            <div key={product.id}>
              <ProductItem product={product} className="min-w-full" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedProductsPage;
