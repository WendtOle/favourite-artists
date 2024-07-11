"use client";

import { useEffect, useState } from "react";
import { TimeRange, topArtists } from "./lib/actions";
import { TimeRangeToggle } from "./TimeRangeToggle";
import Link from "next/link";
import { AuthorizationTokens } from "./types";
import { refreshAccessToken } from "./lib/clientActions";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

export const TopArtists = ({
  authorizationTokens,
}: {
  authorizationTokens: AuthorizationTokens;
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");

  const { isPending, data: artists } = useQuery({
    queryKey: ["topArtists", timeRange],
    queryFn: async () => {
      await refreshAccessToken(authorizationTokens);
      const response = await topArtists(authorizationTokens, timeRange);
      if (!response) {
        return null;
      }
      return response.items;
    },
  });

  if (!authorizationTokens) {
    return null;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center p-2 w-full">
        <h2 className="text-xl">Top Artists</h2>
        <div className="flex flex-row items-center">
          {isPending && <FaSpinner className="animate-spin mr-1" />}
          <TimeRangeToggle
            setTimeRange={setTimeRange}
            selectedTimeRange={timeRange}
          />
        </div>
      </div>
      <ul className="ml-4 flex flex-wrap">
        {(artists ?? []).map((artist) => (
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
