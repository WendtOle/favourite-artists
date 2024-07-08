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
    <div>
      <div className="flex justify-between m-2 items-center">
        <h2 className="text-lg underline">Top Tracks</h2>
        <TimeRangeToggle
          setTimeRange={setTimeRange}
          selectedTimeRange={timeRange}
        />
      </div>
      <ul className="ml-4">
        {tracks.map((track) => (
          <li key={track.id}>
            <Link href={track.external_urls.spotify} target="_blank">
              {track.name} -{" "}
              {track.artists.reduce((acc, artist) => {
                if (acc.endsWith("...")) {
                  return acc;
                }
                if (acc.length > 10) {
                  return acc + "...";
                }
                return acc + artist.name + ", ";
              }, "")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
