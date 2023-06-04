/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import React, { Suspense, useMemo } from "react";
import { Disclosure } from "@headlessui/react";
import { X, Menu as MenuIcon } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@ui/skeleton";
import { ChatSidebarTrigger } from "@/app/chat/candidate/[id]/sidebar";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Navigations = {
  name: string;
  href: string;
  current?: boolean;
}[];

function NavbarMenu({
  navigation,
  profileComponent,
}: {
  /**
   * @explaination NavbarProfileMenu is a rsc component which we stream down to NavbarMenu
   * @see NavbarProfileMenu
   */
  profileComponent: React.ReactNode;
  navigation: Navigations;
}) {
  const [menuIconRef] = useAutoAnimate();
  const [menuConRef] = useAutoAnimate();
  const pathname = usePathname();
  const currentPathIndex = useMemo(
    () => navigation.findIndex((nav) => nav.href === pathname),
    [navigation, pathname]
  );

  return (
    <nav className="z-40 h-fit basis-full">
      <Disclosure
        as="div"
        className="supports-backdrop-blur:bg-background/60 relative border-b bg-background/80 backdrop-blur"
      >
        {({ open }) => (
          <>
            <div className=" px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex flex-shrink-0 items-center">
                  {/* logo only on desktop */}
                  <Image
                    priority
                    src="/logo.png"
                    alt="ada-ai logo"
                    width={40}
                    height={40}
                    className="hidden h-8 w-auto md:block"
                  />
                </div>
                <div className="inset-y-0 left-0 flex items-center ">
                  {/* Mobile menu button*/}
                  <Disclosure.Button
                    ref={menuIconRef}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:hidden"
                  >
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                  {/* Trigger chat sidebar on mobile */}
                  <ChatSidebarTrigger />
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item, index) => {
                        const isCurrent = index === currentPathIndex;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              isCurrent
                                ? "bg-gray-800 text-white dark:bg-gray-900"
                                : "text-gray-500 hover:bg-gray-800 hover:text-white dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={isCurrent ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Suspense
                    fallback={<Skeleton className="h-8 w-8 rounded-full" />}
                  >
                    {profileComponent}
                  </Suspense>
                </div>
              </div>
            </div>
            <div
              className="absolute h-fit w-full bg-inherit sm:hidden"
              id="mobile-menu"
              ref={menuConRef}
            >
              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item, index) => {
                    const isCurrent = index === currentPathIndex;
                    return (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        href={item.href}
                        className={classNames(
                          isCurrent
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    );
                  })}
                </div>
              </Disclosure.Panel>
            </div>
          </>
        )}
      </Disclosure>
    </nav>
  );
}

export default NavbarMenu;
