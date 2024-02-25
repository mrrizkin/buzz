import { sidebarPin } from "@/store/global";
import { A } from "@solidjs/router";
import { type ParentProps } from "solid-js";

import { cn } from "@/lib/utils";

function Sidebar(props: ParentProps) {
  return (
    <div
      class="fixed h-[100dvh] group z-[99] border-border border-r hover:w-[250px] bg-card text-card-foreground flex flex-col transition-[width] motion-reduce:transition-none lg:-translate-x-0"
      classList={{
        "lg:w-[250px]": sidebarPin(),
        "-translate-x-[60px] w-[60px]": !sidebarPin(),
        "-translate-x-0 w-[250px]": sidebarPin(),
      }}>
      <div class={cn("h-14 px-4 flex items-center shrink-0 overflow-hidden group-hover:px-4", !sidebarPin() && "px-1")}>
        <A href="/" class="flex items-enter gap-x-2 ml-4">
          <img src="/notified.svg" />
          <h1
            class={cn(
              "font-bold text-lg transition motion-reduce:transition-none overflow-hidden text-emerald-600 opacity-100 group-hover:opacity-100",
              !sidebarPin() && "opacity-0",
            )}>
            WAHub
          </h1>
        </A>
      </div>
      {props.children}
      <span class="px-4 text-xs opacity-100" classList={{ "lg:opacity-0 group-hover:opacity-100": !sidebarPin() }}>
        v0.1.0
      </span>
    </div>
  );
}

export default Sidebar;
