import { spotifyApi } from "./getSpotifyApi";

export const replaceTracksInPlaylist = async (playlistId: string, tracks: string[], accessToken: string) => {
    spotifyApi.setAccessToken(accessToken);
    await spotifyApi.replaceTracksInPlaylist(playlistId, tracks);
}