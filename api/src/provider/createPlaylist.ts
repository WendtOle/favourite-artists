import { spotifyApi } from "./getSpotifyApi"

export const createPlaylist = async (accessToken: string, playlistName: string, description: string) => {
    spotifyApi.setAccessToken(accessToken);
    return await spotifyApi.createPlaylist(playlistName, {public: false, description})
}