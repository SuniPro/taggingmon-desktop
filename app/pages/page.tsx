import { Link } from "react-router";
import type { Route } from "../+types/root";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const Page_Root = ({}: Route.ComponentProps) => {
  return (
    <main className="w-fit mx-auto py-20">
      <div>Home</div>
      <div>
        <Link to={"/test"}>to test</Link>
      </div>
    </main>
  );
};
export default Page_Root;
