import { sidebarPin, toggleSidebarPin } from "@/store/global";
import { CgMenu, CgMenuLeftAlt } from "solid-icons/cg";
import { TbBell, TbHelpCircle, TbSearch } from "solid-icons/tb";
import { Show } from "solid-js";

import { Button } from "@/components/ui/button";

import { UserNav } from "./user-nav";

function Header() {
  function openCommand() {
    const ninjaKeys = document.querySelector("ninja-keys");
    if (ninjaKeys) {
      // @ts-ignore
      ninjaKeys.open();
    }
  }

  return (
    <div class="border-b border-border sticky top-0 z-[98] bg-card/80 backdrop-blur-lg">
      <div class="flex h-14 items-center gap-x-4 px-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebarPin} class="hidden lg:inline-flex">
          <Show when={sidebarPin()} fallback={<CgMenu class="w-5 h-5 text-muted-foreground" />}>
            <CgMenuLeftAlt class="w-5 h-5 text-muted-foreground" />
          </Show>
        </Button>
        <Button variant="outline" class="text-muted-foreground hover:text-muted-foreground" onClick={openCommand}>
          <TbSearch class="w-5 h-5 md:mr-4 mr-0" />
          <span class="text-sm hidden md:inline-block">Search or type a command</span>
          <div class="ml-8 hidden lg:block space-x-2">
            <kbd class="text-xs hidden lg:inline-block">CTRL</kbd>
            <kbd class="text-xs hidden lg:inline-block">+</kbd>
            <kbd class="text-xs hidden lg:inline-block">K</kbd>
          </div>
        </Button>
        <div class="ml-auto flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebarPin} class="lg:hidden inline-flex">
              <Show when={sidebarPin()} fallback={<CgMenu class="w-5 h-5 text-muted-foreground" />}>
                <CgMenuLeftAlt class="w-5 h-5 text-muted-foreground" />
              </Show>
            </Button>
            <Button variant="ghost" size="sm">
              <TbHelpCircle class="w-5 h-5 rotate-0 scale-100 transition-all text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm">
              <TbBell class="w-5 h-5 rotate-0 scale-100 transition-all text-muted-foreground" />
            </Button>
          </div>
          <div class="h-8 w-1 border-l border-border"></div>
          <UserNav />
        </div>
      </div>
    </div>
  );
}

export default Header;
