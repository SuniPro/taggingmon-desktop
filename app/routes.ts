import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./pages/page.tsx"),

  route("/test", "./pages/test/page.tsx"),
] satisfies RouteConfig;
