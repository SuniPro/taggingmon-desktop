import { Link } from "react-router";
import type { Route } from "../+types/layout";

export const meta = ({}: Route.MetaArgs) => {
  return [{ title: "Test Page" }];
};

const Page = () => {
  return (
    <main className="w-fit mx-auto py-20">
      <div>test page</div>
      <Link to="/" className="bg-blue-700">
        to home
      </Link>
    </main>
  );
};

export default () => <Page />;
