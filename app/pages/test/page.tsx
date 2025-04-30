import { Link } from "react-router";

const Page_Test = () => {
  return (
    <main className="w-fit mx-auto py-20">
      <div>Test</div>
      <div>
        <Link to={"/"}>to Home</Link>
      </div>
    </main>
  );
};

export default Page_Test;
