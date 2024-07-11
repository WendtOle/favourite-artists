"use client";

import { useEffect, useState } from "react";
import { TimeRange, topArtists } from "./lib/actions";
import { TimeRangeToggle } from "./TimeRangeToggle";
import Link from "next/link";
import { AuthorizationTokens } from "./types";
import { refreshAccessToken } from "./lib/clientActions";

export const TopArtists = ({
  authorizationTokens,
}: {
  authorizationTokens: AuthorizationTokens;
}) => {
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");

  useEffect(() => {
    const setTopArtists = async () => {
      await refreshAccessToken(authorizationTokens);
      topArtists(authorizationTokens, timeRange).then((artists) => {
        if (!artists) {
          return;
        }
        setArtists(artists);
      });
    };
    setTopArtists();
  }, [authorizationTokens, timeRange]);

  if (!authorizationTokens) {
    return null;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center p-2 w-full">
        <h2 className="text-xl">Top Artists</h2>
        <TimeRangeToggle
          setTimeRange={setTimeRange}
          selectedTimeRange={timeRange}
        />
      </div>
      <ul className="ml-4 flex flex-wrap">
        {artists.map((artist) => (
          <li
            key={artist.id}
            className="border px-3 py-1 mr-1 mb-1 text-sm rounded-full"
          >
            <Link href={artist.external_urls.spotify} target="_blank">
              {artist.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
