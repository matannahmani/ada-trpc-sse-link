import { getServerAuthSession } from "@/server/auth";
import NavbarMenu from "./navbar-menu";
import NavbarRoutes from "./navbar-routes";
import NavbarProfileMenu from "./profile-menu";
import { Suspense } from "react";

/**
 * @explaination - we break into two components to stream down the route to the navbar
 * @returns - A navbar with the routes from src/components/navbar/navbar-routes.tsx
 */
async function NavbarSuspense() {
  const session = await getServerAuthSession();

  return (
    <NavbarMenu
      // @ts-expect-error async component is not supported by typescript
      profileComponent={<NavbarProfileMenu />}
      navigation={NavbarRoutes.filter(
        (route) => (route.requiresAuth && !!session) || !route.requiresAuth
      ).map((route) => ({
        name: route.text,
        href: typeof route.path === "function" ? route.path() : route.path,
        current: false,
      }))}
    />
  );
}

function NavbarUnAuthanticated() {
  return (
    <NavbarMenu
      // @ts-expect-error async component is not supported by typescript
      profileComponent={<NavbarProfileMenu />}
      navigation={NavbarRoutes.map((route) => ({
        name: route.text,
        href: typeof route.path === "function" ? route.path() : route.path,
        current: false,
      }))}
    />
  );
}

/**
 * @explaination - we break into two components to stream down the route to the navbar
 */
function Navbar() {
  return (
    <Suspense fallback={<NavbarUnAuthanticated />}>
      {/* @ts-expect-error async compoennt - not supported by typescript */}
      <NavbarSuspense />
    </Suspense>
  );
}

export default Navbar;
