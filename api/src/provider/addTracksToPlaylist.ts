import { spotifyApi } from "./getSpotifyApi";

export const addTracksToPlaylist = async (accessToken: string, playlistId: string, trackUris: string[]) => {
    spotifyApi.setAccessToken(accessToken);
    await spotifyApi.addTracksToPlaylist(playlistId, trackUris)
}
