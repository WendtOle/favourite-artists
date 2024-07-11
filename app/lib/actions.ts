"use server";

import SpotifyWebApi from "spotify-web-api-node";
import { AuthorizationTokens } from "../types";

export const authorizedURL = async () => {
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  });

  const url = spotifyApi.createAuthorizeURL(["user-top-read"], "some-state");
  return url;
};

export const tokens = async (
  code: string
): Promise<AuthorizationTokens | undefined> => {
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
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
      expires: new Date().getTime() + expires_in * 1000,
    };
  } catch (error) {
    console.error({ error });
  }
};

export const refreshTokens = async (
  refreshToken: string
): Promise<AuthorizationTokens | undefined> => {
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  });

  spotifyApi.setRefreshToken(refreshToken);

  try {
    const response = await spotifyApi.refreshAccessToken();
    const { body } = response;
    const { expires_in, access_token, refresh_token } = body;
    console.log({
      "experies in": expires_in,
      "access token": access_token,
      "refresh token": refresh_token,
    });

    const notNullableRefreshToken = refresh_token || refreshToken;
    if (!notNullableRefreshToken) {
      throw new Error("No refresh token found");
    }

    return {
      accessToken: access_token,
      refreshToken: notNullableRefreshToken,
      expires: new Date().getTime() + expires_in * 1000,
    };
  } catch (error) {
    console.error({ error });
  }
};

export type TimeRange = "short_term" | "medium_term" | "long_term";

const getSpotifyApi = async (authorizationTokens: AuthorizationTokens) => {
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(authorizationTokens.accessToken);
  return spotifyApi;
};

export const topArtists = async (
  authorizationTokens: AuthorizationTokens,
  timeRange: TimeRange
) => {
  const spotifyApi = await getSpotifyApi(authorizationTokens);

  try {
    const response = await spotifyApi.getMyTopArtists({
      time_range: timeRange,
      limit: 50,
    });
    return response.body;
  } catch (error) {
    console.error({ error });
  }
};

export const topTracks = async (
  authorizationTokens: AuthorizationTokens,
  timeRange: TimeRange
) => {
  const spotifyApi = await getSpotifyApi(authorizationTokens);

  try {
    const response = await spotifyApi.getMyTopTracks({
      time_range: timeRange,
      limit: 50,
    });
    return response.body;
  } catch (error) {
    console.error({ error });
  }
};
