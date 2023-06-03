import { getServerAuthSession } from "@/server/auth";
import ProfileMenuLogged from "./profile-menu-logged";
import ProfileMenuUnlogged from "./profile-menu-unlogged";

async function NavbarProfileMenu() {
  const session = await getServerAuthSession();

  // split the profile menu into two components depending on if the user is logged in or not
  // this also reduces the bundle size
  if (!session) return <ProfileMenuUnlogged />;
  return <ProfileMenuLogged session={session} />;
}

export default NavbarProfileMenu;
