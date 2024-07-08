"use client";

import { useSearchParams } from "next/navigation";
import { tokens as getTokens } from "../lib/actions";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
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
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      window.history.replaceState({}, "", "/");
    });
  }, []);

  useEffect(() => {
    if (areTokensSet) {
      return;
    }
    if (
      localStorage.getItem("accessToken") &&
      localStorage.getItem("refreshToken")
    ) {
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
}
