"use client";

import { Button } from "@/app/_components/ui/button";
import { Restaurant } from "@prisma/client";
import { ChevronLeftIcon, HeartIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RestaurantImageProps {
  restaurant: Pick<Restaurant, "imageUrl" | "name">;
}

const RestaurantImage = ({ restaurant }: RestaurantImageProps) => {
  const router = useRouter();
  return (
    <div className="relative h-[245px] w-screen">
      <Button
        className="absolute left-4 top-4 z-10 rounded-full bg-white text-muted-foreground hover:text-white"
        size={"icon"}
        onClick={() => router.back()}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        variant={"ghost"}
        className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-700 p-0"
      >
        <HeartIcon size={20} className="fill-white" />
      </Button>
      <Image
        src={restaurant.imageUrl}
        alt={restaurant.name}
        fill
        className="object-cover"
      />
    </div>
  );
};

export default RestaurantImage;
