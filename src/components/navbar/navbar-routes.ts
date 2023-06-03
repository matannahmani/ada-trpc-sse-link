type NavbarRoute = {
  path: string | (() => string);
  i18nKey: string;
  /**
   * @default false
   * @description If true, the user must be authenticated to view this route.
   */
  requiresAuth?: boolean;
  icon?: string;
  /**
   * @deprecated text will be removed in the future in favor of i18nKey
   */
  text: string;
};

const NavbarRoutes: NavbarRoute[] = [
  {
    path: "/",
    text: "Home",
    i18nKey: "navbar.home",
  },
  {
    path: "/chat",
    text: "Chat",
    i18nKey: "navbar.chat",
    requiresAuth: true,
  },
  {
    path: "/donate",
    text: "Donate",
    i18nKey: "navbar.donate",
    requiresAuth: true,
  },
  {
    path: "/mission",
    text: "Our Mission",
    i18nKey: "navbar.ourMission",
  },
];

export default NavbarRoutes;
