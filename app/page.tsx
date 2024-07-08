import { authorizedURL } from "@/app/lib/actions";
import Main from "./component";

export default async function Home() {
  const url = await authorizedURL();

  return (
    <main className="">
      <Main url={url} />
    </main>
  );
}
