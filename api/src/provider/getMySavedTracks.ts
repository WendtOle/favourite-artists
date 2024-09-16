import { spotifyApi } from "./getSpotifyApi";

interface GetMySavedTracksProps {
  accessToken: string;
  limit: number;
  page: number;
}

export const getMySavedTracks = async ({
  accessToken,
  limit,
  page,
}: GetMySavedTracksProps): Promise<SpotifyApi.SavedTrackObject[]> => {
  spotifyApi.setAccessToken(accessToken);
  const data = await spotifyApi.getMySavedTracks({
    limit,
    offset: page * limit,
  });
  return data.body.items;
};

export const getMySavedTracksAll = async (
  tracks: SpotifyApi.SavedTrackObject[] = []
): Promise<SpotifyApi.SavedTrackObject[]> => {
  const data = await spotifyApi.getMySavedTracks({
    limit: 50,
    offset: tracks.length,
  });
  const result = data.body.items;
  if (result.length < 50) {
    return tracks;
  }
  return await getMySavedTracksAll([...tracks, ...result]);
};
