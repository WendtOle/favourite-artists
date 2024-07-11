"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TopArtists } from "./TopArtists";
import { TopTracks } from "./TopTracks";
import {
  assertAuthorizationTokens,
  AUTHORIZATION_TOKENS,
  AuthorizationTokens,
} from "./types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Main({ url }: { url: string }) {
  const [accessToken, setAccessToken] = useState<
    AuthorizationTokens | undefined
  >(undefined);

  useEffect(() => {
    if (accessToken) {
      return;
    }
    if (localStorage.getItem(AUTHORIZATION_TOKENS)) {
      const rawTokenStrings = localStorage.getItem(AUTHORIZATION_TOKENS);
      if (!rawTokenStrings) {
        throw new Error("No tokens found");
      }
      const rawTokens = JSON.parse(rawTokenStrings);
      assertAuthorizationTokens(rawTokens);
      setAccessToken(rawTokens);
    }
  });

  if (!accessToken) {
    return (
      <Link href={url} className="px-4 py-2 rounded-xl shadow uppercase">
        Authorize Spotify
      </Link>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center">
        <TopArtists authorizationTokens={accessToken} />
        <TopTracks authorizationTokens={accessToken} />
      </div>
    </QueryClientProvider>
  );
}
