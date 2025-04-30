import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./route/layout.tsx", [
    index("./route/page.tsx"),

    route("/test", "./route/test/page.tsx"),
  ]),
] satisfies RouteConfig;
