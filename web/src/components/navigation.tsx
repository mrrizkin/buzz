import { sidebarPin } from "@/store/global";
import { A, AnchorProps, useMatch } from "@solidjs/router";
import {
  TbBrandWhatsapp,
  TbChevronDown,
  TbDashboard,
  TbFlag,
  TbSettings,
  TbShieldStar,
  TbSquareAsterisk,
  TbUsers,
} from "solid-icons/tb";
import { JSX, ParentProps, createSignal, splitProps } from "solid-js";
import { Show } from "solid-js";

import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";

import { buttonVariants } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

function Navigation() {
  return (
    <div class="transition-[margin] motion-reduce:transition-none flex-1">
      <GroupNavigation>
        <div class="space-y-1">
          <NavLink href="/">
            <TbDashboard class="w-4 h-4 text-muted-foreground" />
            <span class="font-normal overflow-hidden">Dashboard</span>
          </NavLink>
          <NavLink href="/sender">
            <TbBrandWhatsapp class="w-4 h-4 text-muted-foreground" />
            <span class="font-normal overflow-hidden">Sender</span>
          </NavLink>
        </div>
      </GroupNavigation>
      <Separator orientation="horizontal" />
      <GroupNavigation name="Admin">
        <div class="space-y-1">
          <SubMenu
            name="User"
            icon={<TbUsers class="w-4 h-4 text-muted-foreground" />}
            links={["/config/user", "/config/user/list", "/config/user/create"]}>
            <div class="space-y-1">
              <NavLink href="/config/user">
                <span class="font-normal overflow-hidden">Overview</span>
              </NavLink>
              <NavLink href="/config/user/list">
                <span class="font-normal overflow-hidden">List User</span>
              </NavLink>
              <NavLink href="/config/user/create">
                <span class="font-normal overflow-hidden">Create User</span>
              </NavLink>
            </div>
          </SubMenu>
          <NavLink href="/config/role">
            <TbShieldStar class="w-4 h-4 text-muted-foreground" />
            <span class="font-normal overflow-hidden">Role</span>
          </NavLink>
          <NavLink href="/config/serial-number">
            <TbSquareAsterisk class="w-4 h-4 text-muted-foreground" />
            <span class="font-normal overflow-hidden">Serial Number</span>
          </NavLink>
        </div>
      </GroupNavigation>
      <Separator orientation="horizontal" />
      <GroupNavigation name="System">
        <div class="space-y-1">
          <NavLink href="/system/flag">
            <TbFlag class="w-4 h-4 text-muted-foreground" />
            <span class="font-normal overflow-hidden">Flag</span>
          </NavLink>
          <NavLink href="/system/setting">
            <TbSettings class="w-4 h-4 text-muted-foreground" />
            <span class="font-normal overflow-hidden">Setting</span>
          </NavLink>
        </div>
      </GroupNavigation>
    </div>
  );
}

function NavLink(props: AnchorProps) {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <A
      activeClass="bg-secondary"
      class={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "flex items-center justify-start gap-x-2 hover:bg-secondary/80 h-9 text-secondary-foreground px-3",
        local.class,
      )}
      {...others}
      end
    />
  );
}

function SubMenu(
  props: ParentProps<{
    name?: string | undefined;
    icon?: JSX.Element;
    links?: string[];
  }>,
) {
  function isMatch() {
    if (!props.links) {
      return false;
    }

    for (const link of props.links) {
      if (useMatch(() => link)()) {
        return true;
      }
    }

    return false;
  }

  const [open, setOpen] = createSignal(isMatch());

  return (
    <Collapsible open={open()} onOpenChange={setOpen}>
      <CollapsibleTrigger
        class={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "flex items-center justify-start gap-x-2 hover:bg-secondary/80 h-9 px-3 text-secondary-foreground w-full",
        )}>
        <Show when={props.icon}>{props.icon}</Show>
        <Show when={props.name}>
          <span class="font-normal overflow-hidden">{props.name}</span>
          <span class="flex-1 flex justify-end overflow-hidden">
            <TbChevronDown class="size-4 text-muted-foreground" />
          </span>
        </Show>
      </CollapsibleTrigger>
      <CollapsibleContent class={cn("my-2 border-l ml-4 pl-2 hidden group-hover:block", sidebarPin() && "block")}>
        {props.children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function GroupNavigation(props: ParentProps<{ name?: string | undefined }>) {
  return (
    <div class={cn("py-4 px-4 group-hover:px-4", !sidebarPin() && "px-2")}>
      <Show when={props.name}>
        <div
          class="ml-3 text-xs text-muted-foreground uppercase group-hover:h-[initial] group-hover:mb-2 overflow-hidden transition-[height] motion-reduce:transition-none h-0"
          classList={{
            "lg:h-0": !sidebarPin(),
            "lg:h-[initial] mb-2": sidebarPin(),
          }}>
          {props.name}
        </div>
      </Show>
      {props.children}
    </div>
  );
}

export default Navigation;
