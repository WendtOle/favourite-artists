import { spotifyApi } from "./getSpotifyApi";

interface GetFollowedArtists {
  accessToken: string;
}

export const getFollowedArtists = async ({
  accessToken,
}: GetFollowedArtists) => {
  spotifyApi.setAccessToken(accessToken);
  return await requestMoreFollowedArtists({ accessToken, artists: [] });
};

const requestMoreFollowedArtists = async ({
  accessToken,
  artists,
}: GetFollowedArtists & {
  artists: Array<SpotifyApi.ArtistObjectFull>;
}): Promise<Array<SpotifyApi.ArtistObjectFull>> => {
  const { body } = await spotifyApi.getFollowedArtists({
    limit: 50,
    after: artists[artists.length - 1]?.id,
  });
  const newArtists = body.artists.items;
  if (newArtists.length === 0) return artists;
  return requestMoreFollowedArtists({
    accessToken,
    artists: [...artists, ...newArtists],
  });
};
