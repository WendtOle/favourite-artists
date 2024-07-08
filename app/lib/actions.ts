"use server";

import SpotifyWebApi from "spotify-web-api-node";

export const authorizedURL = async () => {
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000/authorization",
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  });

  const url = spotifyApi.createAuthorizeURL(["user-top-read"], "some-state");
  return url;
};

export const tokens = async (code: string) => {
  console.log("token", code);
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000/authorization",
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  });

  try {
    const response = await spotifyApi.authorizationCodeGrant(code);
    const { body } = response;
    const { expires_in, access_token, refresh_token } = body;
    console.log({
      "experies in": expires_in,
      "access token": access_token,
      "refresh token": refresh_token,
    });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  } catch (error) {
    console.error({ error });
  }
};

export type TimeRange = "short_term" | "medium_term" | "long_term";

export const topArtists = async (accessToken: string, timeRange: TimeRange) => {
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const response = await spotifyApi.getMyTopArtists({
      time_range: timeRange,
    });
    return response.body.items;
  } catch (error) {
    console.error({ error });
  }
};

export const topTracks = async (
  accessToken: string,
  timeRange: TimeRange
): Promise<SpotifyApi.TrackObjectFull[] | undefined> => {
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const response = await spotifyApi.getMyTopTracks({
      time_range: timeRange,
    });
    return response.body.items;
  } catch (error) {
    console.error({ error });
  }
};
