import { toggleSidebarPin } from "@/store/global";
import { ColorModeContextType } from "@kobalte/core";
import { Navigator } from "@solidjs/router";

export type ActionCtx = {
  color: ColorModeContextType;
  navigate: Navigator;
};

const toggleSidebarAction = {
  id: "Toggle Sidebar",
  title: "Toggle Sidebar",
  mdIcon: "toggle_on",
  hotkey: "ctrl+b",
  handler: toggleSidebarPin,
};

function switchThemeAction(ctx: ActionCtx) {
  return [
    {
      id: "Theme",
      title: "Change theme...",
      mdIcon: "desktop_windows",
      children: ["Light Theme", "Dark Theme", "System Theme"],
    },
    {
      id: "Light Theme",
      title: "Change theme to Light",
      mdIcon: "light_mode",
      parent: "Theme",
      handler: () => {
        ctx.color.setColorMode("light");
      },
    },
    {
      id: "Dark Theme",
      title: "Change theme to Dark",
      mdIcon: "dark_mode",
      parent: "Theme",
      handler: () => {
        ctx.color.setColorMode("dark");
      },
    },
    {
      id: "System Theme",
      title: "Change theme to System",
      mdIcon: "brightness_auto",
      parent: "Theme",
      handler: () => {
        ctx.color.setColorMode("system");
      },
    },
  ];
}

function logoutAction(ctx: ActionCtx) {
  return {
    id: "Logout",
    title: "Logout",
    mdIcon: "logout",
    handler: () => {
      ctx.navigate("/auth");
    },
  };
}

export function actions(ctx: ActionCtx) {
  return [toggleSidebarAction, ...switchThemeAction(ctx), logoutAction(ctx)];
}
