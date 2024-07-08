"use client";

import { useEffect, useState } from "react";
import { TimeRange, topArtists } from "./lib/actions";
import { TimeRangeToggle } from "./TimeRangeToggle";
import Link from "next/link";

export const TopArtists = ({ accessToken }: { accessToken: string }) => {
  const [artists, setArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");

  useEffect(() => {
    topArtists(accessToken, timeRange).then((artists) => {
      if (!artists) {
        return;
      }
      setArtists(artists);
    });
  }, [accessToken, timeRange]);

  if (!accessToken) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between m-2 items-center">
        <h2 className="text-lg underline">Top Artists</h2>
        <TimeRangeToggle
          setTimeRange={setTimeRange}
          selectedTimeRange={timeRange}
        />
      </div>
      <ul className="ml-4">
        {artists.map((artist) => (
          <li key={artist.id}>
            <Link href={artist.external_urls.spotify} target="_blank">
              {artist.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
