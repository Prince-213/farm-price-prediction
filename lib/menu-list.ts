import { SquarePen, LayoutGrid, LucideIcon, BellDot } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dash/farm",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Forum",
      menus: [
        {
          href: "",
          label: "Forum",
          icon: SquarePen,
          submenus: [
            {
              href: "/dash/farm/posts",
              label: "Community"
            },
            /* {
              href: "/dash/farm/posts/new",
              label: "New Post"
            } */
          ]
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/dash/farm/notifications",
          label: "Notifications",
          icon: BellDot
        },
        /* {
          href: "/account",
          label: "Account",
          icon: Settings
        } */
      ]
    }
  ];
}
