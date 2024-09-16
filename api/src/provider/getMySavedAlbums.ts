import { spotifyApi } from "./getSpotifyApi";

export const getMySavedAlbums = async (
  albums: SpotifyApi.SavedAlbumObject[] = []
): Promise<SpotifyApi.SavedAlbumObject[]> => {
  const data = await spotifyApi.getMySavedAlbums({
    limit: 50,
    offset: albums.length,
  });
  const result = data.body.items;
  if (result.length < 50) {
    return albums;
  }
  return await getMySavedAlbums([...albums, ...result]);
};
