import { spotifyApi } from "./getSpotifyApi";

interface GetPlaylistTracksProps {
    playlistId: string
    accessToken: string, 
    limit: number, 
    page: number
}

export const getPlaylistTracks = async ({playlistId, accessToken, limit, page}: GetPlaylistTracksProps): Promise<SpotifyApi.PlaylistTrackObject[]> => {
    spotifyApi.setAccessToken(accessToken);
    const data = await spotifyApi.getPlaylistTracks(playlistId, {limit, offset: page * limit});
    return data.body.items;
}