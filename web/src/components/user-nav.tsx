import { As, useColorMode } from "@kobalte/core";
import { useNavigate } from "@solidjs/router";
import { TbCreditCard, TbSettings, TbUser } from "solid-icons/tb";
import { createEffect } from "solid-js";

import { generateAvatarUrl } from "@/lib/utils";

import { useUser } from "@/services/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Switch } from "./ui/switch";

export function UserNav() {
  const { setColorMode, colorMode } = useColorMode();
  const user = useUser();
  const navigate = useNavigate();

  createEffect(() => {
    if (user.status === "error") {
      if ((user.error as unknown as Response | undefined)?.status === 401) {
        navigate("/auth", { replace: true });
      }
    }
  });

  return (
    <DropdownMenu placement="bottom-end" gutter={12}>
      <DropdownMenuTrigger asChild>
        <As component={Button} variant="ghost" class="relative h-8 w-8 rounded-full">
          <Avatar class="h-8 w-8">
            <AvatarImage
              src={generateAvatarUrl({
                name: user.data?.data.username || "johndoe",
                style: "big-smile",
                backgroundColors: ["#d6e6ff", "#d7f9f8", "#ffffea", "#fff0d4", "#fbe0e0", "#e5d4ef"],
              })}
              alt={user.data?.data.username || "johndoe"}
            />
            <AvatarFallback>{user.data?.data.username.charAt(0).toUpperCase() || "J"}</AvatarFallback>
          </Avatar>
        </As>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56 z-[100]">
        <DropdownMenuLabel class="font-normal px-3 py-2">
          <div class="flex gap-4">
            <Avatar class="h-8 w-8">
              <AvatarImage
                src={generateAvatarUrl({
                  name: user.data?.data.username || "johndoe",
                  style: "big-smile",
                  backgroundColors: ["#d6e6ff", "#d7f9f8", "#ffffea", "#fff0d4", "#fbe0e0", "#e5d4ef"],
                })}
                alt={user.data?.data.username || "johndoe"}
              />
              <AvatarFallback>{user.data?.data.username.charAt(0).toUpperCase() || "J"}</AvatarFallback>
            </Avatar>
            <div class="flex flex-col space-y-1">
              <p class="font-medium leading-none">{user.data?.data.name}</p>
              <p class="text-muted-foreground text-sm leading-none">{user.data?.data.username}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="px-4 py-2">
          <TbCreditCard class="w-5 h-5 mr-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem class="px-4 py-2">
          <TbSettings class="w-5 h-5 mr-4" />
          Setting
        </DropdownMenuItem>
        <DropdownMenuItem class="px-4 py-2">
          <TbUser class="w-5 h-5 mr-4" />
          My account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel class="pl-4 pr-2 py-2">
          <div class="flex items-center justify-between">
            <span class="font-normal leading-none">Dark mode</span>
            <Switch
              checked={colorMode() === "dark"}
              onChange={(checked) => {
                if (checked) {
                  setColorMode("dark");
                }
                if (!checked) {
                  setColorMode("light");
                }
              }}
            />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          class="px-4 py-2"
          onSelect={() => {
            navigate("/auth", { replace: true });
          }}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
