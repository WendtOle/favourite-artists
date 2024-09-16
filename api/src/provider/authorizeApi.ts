import { spotifyApi } from "./getSpotifyApi";

require("dotenv").config();

export const getTokens = async (
  code: string
): Promise<{
  data?: { accessToken: string; refreshToken: string };
  error?: string;
}> => {
  try {
    const { body } = await spotifyApi.authorizationCodeGrant(code);
    const { expires_in, access_token, refresh_token } = body;
    console.log({
      "experies in": expires_in,
      "access token": access_token,
      "refresh token": refresh_token,
    });

    return {
      data: {
        accessToken: access_token,
        refreshToken: refresh_token,
      },
    };
  } catch (err: any) {
    console.log("/authenticate - ", {
      body: err.body,
      errorId: err.body.error,
      statusCode: err.statusCode,
    });
    return { error: err.body.error_description };
  }
};
