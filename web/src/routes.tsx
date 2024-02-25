import { HashRouter, Route } from "@solidjs/router";
import { lazy } from "solid-js";

import AdminLayout from "@/layout/admin";
import AuthLayout from "@/layout/auth";
import BaseLayout from "@/layout/base";

const LoginPage = lazy(() => import("@/pages/auth/login"));

const DashboardPage = lazy(() => import("@/pages/dashboard"));
const SenderPage = lazy(() => import("@/pages/sender"));
const SenderDetailPage = lazy(() => import("@/pages/sender/detail"));

const UserPage = lazy(() => import("@/pages/config/user"));
const RolePage = lazy(() => import("@/pages/config/role"));

const FlagPage = lazy(() => import("@/pages/system/flag"));
const SettingPage = lazy(() => import("@/pages/system/setting"));

const NotFoundPage = lazy(() => import("@/pages/404"));

export function Routes() {
  return (
    <HashRouter root={BaseLayout}>
      <Route path="/" component={AdminLayout}>
        <Route path="/" component={DashboardPage} />
        <Route path="/sender" component={SenderPage} />
        <Route path="/sender/:id" component={SenderDetailPage} />

        <Route path="/config/user" component={UserPage} />
        <Route path="/config/role" component={RolePage} />

        <Route path="/system/flag" component={FlagPage} />
        <Route path="/system/setting" component={SettingPage} />
      </Route>
      <Route path="/auth" component={AuthLayout}>
        <Route path="/login" component={LoginPage} />
      </Route>
      <Route path="/*" component={NotFoundPage} />
    </HashRouter>
  );
}
