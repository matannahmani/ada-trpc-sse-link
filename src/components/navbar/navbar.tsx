import NavbarMenu from "./navbar-menu";
import NavbarRoutes from "./navbar-routes";
import NavbarProfileMenu from "./profile-menu";
// tailwind css navbar
function Navbar() {
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

export default Navbar;
