import { spotifyApi } from "./getSpotifyApi";

export const getUserId = async (accessToken: string) => {
    spotifyApi.setAccessToken(accessToken)
    const data = await spotifyApi.getMe();
    const userId = data.body.id;
    return userId;
}

