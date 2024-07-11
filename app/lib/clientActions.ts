import { AuthorizationTokens } from "../types";
import { refreshTokens } from "./actions";

export const refreshAccessToken = async ({
  expires,
  refreshToken,
}: AuthorizationTokens) => {
  const isExpired = new Date().getTime() > expires;
  if (!isExpired) {
    return;
  }
  const tokens = await refreshTokens(refreshToken);
  if (!tokens) {
    throw new Error("No tokens found");
  }
  localStorage.setItem("authorizationTokens", JSON.stringify(tokens));
};
