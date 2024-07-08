"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TopArtists } from "./TopArtists";
import { TopTracks } from "./TopTracks";

export default function Main({ url }: { url: string }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      return;
    }
    if (
      localStorage.getItem("accessToken") &&
      localStorage.getItem("refreshToken")
    ) {
      setAccessToken(localStorage.getItem("accessToken"));
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
    <div className="flex flex-col items-center">
      <TopArtists accessToken={accessToken} />
      <TopTracks accessToken={accessToken} />
    </div>
  );
}
