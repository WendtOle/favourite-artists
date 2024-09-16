import { spotifyApi } from "./getSpotifyApi";

export enum Festival {
  FUSION_2023 = "fusion-2023",
  TARMAC_2022 = "tarmac-2022",
  TOMORROWLAND_2023 = "tomorrowland-2023",
  TARMAC_2023 = "tarmac-2023",
}

export const searchArtist = async (
  query: string
): Promise<SpotifyApi.ArtistObjectFull | { name: string }> => {
  const response = await spotifyApi.searchArtists(query, { limit: 5 });
  const artists = response.body.artists?.items;
  if (!artists) {
    console.log(`No artists found on Spotify for "${query}"`);
    return { name: query };
  }
  const matchedArtist = artists.find(
    ({ name }) => name.toLowerCase() === query.toLowerCase()
  );
  if (!matchedArtist) {
    /* console.log(
      `No exact match found for "${query}". Only found ${artists
        .map(({ name }) => name)
        .join(", ")}.`
    );*/
    return { name: query };
  }
  return matchedArtist;
};
