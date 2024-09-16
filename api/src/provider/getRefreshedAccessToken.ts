import { spotifyApi } from "./getSpotifyApi";

export const getRefreshedAccessToken = async (refreshToken: string): Promise<string> => {
    spotifyApi.setRefreshToken(refreshToken)
    const response = await spotifyApi.refreshAccessToken()
    return response.body['access_token'];
}