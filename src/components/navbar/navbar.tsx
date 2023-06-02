import NavbarMenu from "./navbar-menu";
import NavbarRoutes from "./navbar-routes";
// tailwind css navbar
function Navbar() {
  return (
    <NavbarMenu
      navigation={NavbarRoutes.map((route) => ({
        name: route.text,
        href: typeof route.path === "function" ? route.path() : route.path,
        current: false,
      }))}
    />
  );
}

export default Navbar;
