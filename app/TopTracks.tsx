"use client";

import { useEffect, useState } from "react";
import { TimeRange, topTracks } from "./lib/actions";
import { TimeRangeToggle } from "./TimeRangeToggle";
import Link from "next/link";

export const TopTracks = ({ accessToken }: { accessToken: string }) => {
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");

  useEffect(() => {
    topTracks(accessToken, timeRange).then((tracks) => {
      if (!tracks) {
        return;
      }
      setTracks(tracks);
    });
  }, [accessToken, timeRange]);

  if (!accessToken) {
    return null;
  }

  return (
    <div className="max-w-2xl w-full">
      <div className="flex justify-between items-center p-2 w-full">
        <h2 className="text-xl">Top Tracks</h2>
        <TimeRangeToggle
          setTimeRange={setTimeRange}
          selectedTimeRange={timeRange}
        />
      </div>
      <ul className="ml-4 max-h-80 overflow-scroll">
        {tracks.map((track) => (
          <li key={track.id} className="mb-2 text-sm">
            <Link href={track.external_urls.spotify} target="_blank">
              <p>{track.name}</p>
              <p className="text-slate-500">
                {track.artists.reduce((acc, artist) => {
                  if (acc.endsWith("...")) {
                    return acc;
                  }
                  if (acc.length > 25) {
                    return acc + "...";
                  }
                  if (acc.length === 0) {
                    return artist.name;
                  }
                  return acc + ", " + artist.name;
                }, "")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
