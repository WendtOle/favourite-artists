import { isAllowedOrigin } from "../isAllowedOrigin";
import { spotifyApi } from "./getSpotifyApi";
import { scopes } from "../shopifyAuthorisationScopes";

export const createAuthorizeURL = (requestOrigin: string) => {
    if (isAllowedOrigin(requestOrigin)) {
        spotifyApi.setRedirectURI(requestOrigin)
    }
    return spotifyApi.createAuthorizeURL(scopes, 'some-state-of-my-choice', true);
}