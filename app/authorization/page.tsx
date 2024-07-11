"use client";

import { useSearchParams } from "next/navigation";
import { tokens as getTokens } from "../lib/actions";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { AUTHORIZATION_TOKENS } from "../types";

export default function Home() {
  return (
    <Suspense>
      <InnerHome />
    </Suspense>
  );
}

const InnerHome = () => {
  const [areTokensSet, setAreTokensSet] = useState(false);
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      console.log("No code found");
      return;
    }
    getTokens(code).then((tokens) => {
      if (!tokens) {
        return;
      }
      localStorage.setItem(AUTHORIZATION_TOKENS, JSON.stringify(tokens));
      window.history.replaceState({}, "", "/");
    });
  }, []);

  useEffect(() => {
    if (areTokensSet) {
      return;
    }
    if (localStorage.getItem(AUTHORIZATION_TOKENS)) {
      setAreTokensSet(true);
    }
  });

  if (!areTokensSet) {
    return <div>Loading ...</div>;
  }
  return (
    <div>
      <p>Successfully authorized</p>
      <Link href="/" className="px-4 py-2 rounded-xl shadow uppercase">
        Go back
      </Link>
    </div>
  );
};
