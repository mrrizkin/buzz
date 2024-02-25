import { useColorMode } from "@kobalte/core";
import { useNavigate } from "@solidjs/router";
import { ParentProps } from "solid-js";
// @ts-ignore
import { NinjaKeys } from "solid-ninja-keys";

function BaseLayout(props: ParentProps) {
  const { colorMode, setColorMode } = useColorMode();
  const navigate = useNavigate();
  const hotkeys = [
    {
      id: "Home",
      title: "Open Home",
      hotkey: "cmd+h",
      mdIcon: "home",
      handler: () => {
        navigate("/");
      },
    },
    {
      id: "Theme",
      title: "Change theme...",
      mdIcon: "desktop_windows",
      children: [
        {
          id: "Light Theme",
          title: "Change theme to Light",
          mdIcon: "light_mode",
          handler: () => {
            setColorMode("light");
          },
        },
        {
          id: "Dark Theme",
          title: "Change theme to Dark",
          mdIcon: "dark_mode",
          keywords: "lol",
          handler: () => {
            setColorMode("dark");
          },
        },
      ],
    },
  ];

  return (
    <>
      {props.children}
      <NinjaKeys isDark={colorMode() === "dark"} hotkeys={hotkeys} />
    </>
  );
}

export default BaseLayout;
