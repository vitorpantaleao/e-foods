"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import {
  HeartIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ScrollTextIcon,
} from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

const Header = () => {
  const { data, status } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  const handleSignIn = () => {
    signIn();
  };

  return (
    <div className="flex items-center justify-between px-5 pt-6">
      <Link href="/">
        <Image src="/images/Logo.png" alt="logo" width={100} height={30} />
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="border-none bg-transparent"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>

          {data?.user ? (
            <>
              <div className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={data?.user?.image as string | undefined}
                    />
                    <AvatarFallback>
                      {data?.user?.name?.split(" ")[0][0]}
                      {data?.user?.name?.split(" ")[1][0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{data?.user?.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {data?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between pt-10">
                <h2 className="font-semibold">Faça seu login</h2>
                <Button size={"icon"} onClick={handleSignIn}>
                  <LogInIcon />
                </Button>
              </div>
            </>
          )}

          {data?.user && (
            <>
              <div className="py-6">
                <Separator />
              </div>

              <div className="space-y-2">
                <Button
                  variant={"ghost"}
                  className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                  asChild
                >
                  <Link href="/">
                    <HomeIcon size={16} />
                    <span className="block">Início</span>
                  </Link>
                </Button>

                <Button
                  variant={"ghost"}
                  className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                  asChild
                >
                  <Link href="/my-orders">
                    <ScrollTextIcon size={16} />
                    <span className="block">Meus Pedidos</span>
                  </Link>
                </Button>

                <Button
                  variant={"ghost"}
                  className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                  asChild
                >
                  <Link href="/my-favorite-restaurants">
                    <HeartIcon size={16} />
                    <span className="block">Restaurantes Favoritos</span>
                  </Link>
                </Button>
              </div>
            </>
          )}

          {data?.user && (
            <>
              <div className="py-6">
                <Separator />
              </div>
              <Button
                variant={"ghost"}
                className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                onClick={handleSignOut}
              >
                <LogOutIcon size={16} />
                <span className="block">Sair da conta</span>
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
