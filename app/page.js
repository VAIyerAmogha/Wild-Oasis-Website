import Link from "next/link";
import Navigation from "./components/Navigation";

export default function Page() {
  return (
    <div>
      <h1>The Wild Osis</h1>
      <Link href="/cabins">Explore the cabins</Link>
    </div>
  );
}
