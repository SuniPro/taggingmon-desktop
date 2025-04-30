import { memo } from "react";
import { Link } from "react-router";
import type { Route } from "../+types/root";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Root Page" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const Page = memo(() => {
  return (
    <main className="w-fit mx-auto py-20">
      <div>main page</div>
      <Link to="/test" className="bg-cyan-700">
        to test
      </Link>
    </main>
  );
});

export default () => <Page />;
