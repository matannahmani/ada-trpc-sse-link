/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { useMemo } from "react";
import { Disclosure } from "@headlessui/react";
import { X, Menu as MenuIcon } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarProfileMenu from "./profile-menu";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Navigations = {
  name: string;
  href: string;
  current?: boolean;
}[];

function NavbarMenu({ navigation }: { navigation: Navigations }) {
  const [menuIconRef] = useAutoAnimate();
  const [menuConRef, enableAnimations] = useAutoAnimate();
  const pathname = usePathname();
  const currentPathIndex = useMemo(
    () => navigation.findIndex((nav) => nav.href === pathname),
    [navigation, pathname]
  );

  return (
    <nav className="h-fit basis-full">
      <Disclosure as="div" className="relative bg-gray-800">
        {({ open }) => (
          <>
            <div className=" px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button
                    ref={menuIconRef}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    {/* logo only on desktop */}
                    <Image
                      priority
                      src="/logo.png"
                      alt="ada-ai logo"
                      width={40}
                      height={40}
                      className="hidden h-8 w-auto lg:block"
                    />
                  </div>
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
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
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
                  {/* Profile dropdown */}
                  <NavbarProfileMenu />
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
