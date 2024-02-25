import { sidebarPin } from "@/store/global";
import { ParentProps } from "solid-js";

import Header from "@/components/header";
import Navigation from "@/components/navigation";
import Sidebar from "@/components/sidebar";

function AdminLayout(props: ParentProps) {
  return (
    <div>
      <Sidebar>
        <Navigation />
      </Sidebar>
      <main
        class="transition-[margin] motion-reduce:transition-none ml-0"
        classList={{ "lg:ml-[250px]": sidebarPin(), "lg:ml-[60px]": !sidebarPin() }}>
        <Header />
        {props.children}
      </main>
    </div>
  );
}

export default AdminLayout;
