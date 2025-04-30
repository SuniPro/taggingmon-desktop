import { memo } from "react";
import { Outlet } from "react-router";
import { Test } from "~/component/test";

const Layout = memo(() => {
  console.log("layout rendered!");

  return (
    <div>
      <div>layout</div>
      <Outlet />
      <Test />
    </div>
  );
});

export default () => <Layout />;
