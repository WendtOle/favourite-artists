const express = require("express");
const url = require("url");
const querystring = require("querystring");
import { join } from "path";

export const app = express();
import { isAllowedOrigin } from "./isAllowedOrigin";
import { timeStamp } from "./getCurrentTimeStamp";
import {
  getMySavedTracks,
  getPlaylistTracks,
  createPlaylist as providerCreatePlaylist,
  addTracksToPlaylist,
  replaceTracksInPlaylist,
  createAuthorizeURL,
  getTokens,
  getUserId,
  checkAccessTokenValid,
  getUserPlaylists,
  getRefreshedAccessToken,
} from "./provider";
import { getFollowedArtists } from "./provider/getFollowedArtists";
import { readFileSync, readdirSync } from "fs";
import { spotifyApi } from "./provider/getSpotifyApi";
import { getMySavedTracksAll } from "./provider/getMySavedTracks";
import { getMySavedAlbums } from "./provider/getMySavedAlbums";
import {
  Festival,
  additionalInformation,
  festivalNames,
} from "./data/festivalInformation";

const setCors = (req: any, res: any) => {
  const requestOrigin = req.headers.origin ?? [];
  if (isAllowedOrigin(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

app.get("/authorizeURL", (req: any, res: any) => {
  setCors(req, res);
  const requestOrigin = req.headers.origin ?? "localhost:3000";
  res.send(createAuthorizeURL(requestOrigin));
});

app.get("/authenticate", async (req: any, res: any) => {
  setCors(req, res);
  const { query } = url.parse(req.url);
  const { code } = querystring.parse(query);
  console.log(`code found: ${code}`);
  const { error, data } = await getTokens(code);
  if (data) {
    res.send(data);
    return;
  }
  res.send(error);
});

app.get("/accessTokenValid", async (req: any, res: any) => {
  setCors(req, res);
  const { query } = url.parse(req.url);
  const { accessToken } = querystring.parse(query);
  try {
    await checkAccessTokenValid(accessToken);
    res.send("ok");
    return;
  } catch (error: any) {
    if (error?.body?.error?.message === "The access token expired") {
      console.log("expired");
      res.send("expired");
      return;
    }
    if (error?.body?.error === "WebapiError") {
      console.log("WebapiError");
      console.log(error?.body?.error);
      return;
    }
    if (error.statusCode === 403) {
      console.log("/accessTokenValid - statuscode 403 - returning 'forbidden'");
      res.send("forbidden").status(403);
      return;
    }
    console.log("/accessTokenValid - ", {
      body: error.body,
      errorId: error.body.error,
      statusCode: error.statusCode,
    });
    res.send("error");
    return;
  }
});

app.get("/refresh", async (req: any, res: any) => {
  setCors(req, res);
  const { query } = url.parse(req.url);
  const { refreshToken } = querystring.parse(query);
  try {
    const newAccessToken = await getRefreshedAccessToken(refreshToken);
    res.send(newAccessToken);
    return;
  } catch (error: any) {
    console.log("/refresh - ", error);
    console.log("some error occured");
  }
});

type Something = Array<{
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  imageUrl?: string;
  albumName: string;
}>;

function toRecord<T, K extends string | number | symbol>(
  array: T[],
  keyExtractor: (item: T) => K
): Record<K, T> {
  return array.reduce((record, item) => {
    const key = keyExtractor(item);
    record[key] = item;
    return record;
  }, {} as Record<K, T>);
}

const extractImageUrl = (images: SpotifyApi.ImageObject[] | null) => {
  if (!images) return undefined;
  const smallestImage = images.reduce(
    (smallest: SpotifyApi.ImageObject, image: SpotifyApi.ImageObject) => {
      if (!image.height || !smallest.height) return smallest;
      if (image.height < smallest.height) return image;
      return smallest;
    },
    images[0]
  );
  return smallestImage.url;
};

app.get("/playlists", async (req: any, res: any) => {
  setCors(req, res);
  const { query } = url.parse(req.url);
  const { accessToken } = querystring.parse(query);
  try {
    const userId = await getUserId(accessToken);
    const recursive = async (
      page = 0
    ): Promise<SpotifyApi.PlaylistObjectSimplified[]> => {
      const nextPage = await getUserPlaylists({ limit: 50, page, accessToken });
      if (nextPage.length === 0) {
        return [];
      }
      return [...nextPage, ...(await recursive(page + 1))];
    };

    const playlists = await recursive();
    const processedPlaylists = playlists
      .filter(
        ({ owner }: SpotifyApi.PlaylistObjectSimplified) => owner.id === userId
      )
      .map(({ id }: SpotifyApi.PlaylistObjectSimplified) => id);
    res.send(processedPlaylists);
    return;
  } catch (err: any) {
    console.log("Error when fetching playlists.");
    console.log(err);
    res.send("error");
    return;
  }
});

app.get("/tracks", async (req: any, res: any) => {
  setCors(req, res);
  const { query } = url.parse(req.url);
  const { accessToken, playlistId } = querystring.parse(query);
  try {
    const recursive = async (
      page = 0
    ): Promise<SpotifyApi.PlaylistTrackObject[]> => {
      await new Promise((r) => setTimeout(r, 500));
      const nextPage = await getPlaylistTracks({
        playlistId,
        accessToken,
        limit: 50,
        page,
      });
      if (nextPage.length === 0) {
        return [];
      }
      return [...nextPage, ...(await recursive(page + 1))];
    };

    const response = await recursive();
    const artistIds: string[] = response
      .map(({ track }) => track)
      .filter((track) => track !== null)
      .flatMap((track: SpotifyApi.TrackObjectFull | null) => {
        if (track === null) throw new Error("track is null");
        const { artists } = track;
        const artistIds = artists.map(({ id }) => id);
        return artistIds;
      });
    const artistIdsUnique = [...new Set(artistIds)];
    res.send(artistIdsUnique);
    return;
  } catch (err: any) {
    console.log(`Error when fetching playlist tracks. "${playlistId}"`);
    console.log(err);
    res.send("error");
    return;
  }
});

app.get("/liked", async (req: any, res: any) => {
  setCors(req, res);
  const { query } = url.parse(req.url);
  const { accessToken } = querystring.parse(query);
  spotifyApi.setAccessToken(accessToken);
  try {
    const tracks = await getMySavedTracksAll();
    const artists = tracks
      .map(({ track }) => track)
      .filter((track) => track !== null)
      .flatMap(({ artists }) => artists);
    res.send(artists);
    return;
  } catch (err: any) {
    console.log("Error when fetching artists of liked tracks.");
    console.log(err);
    res.send("error");
    return;
  }
});

app.get("/savedAlbums", async (req: any, res: any) => {
  setCors(req, res);
  const { query } = url.parse(req.url);
  const { accessToken } = querystring.parse(query);
  spotifyApi.setAccessToken(accessToken);
  try {
    const albums = await getMySavedAlbums();
    const artists = albums.flatMap(({ album }) => album.artists);
    res.send(artists);
    return;
  } catch (err: any) {
    console.log("Error when fetching artists of saved albums.");
    console.log(err);
    res.send("error");
    return;
  }
});

const createPlaylist = async (
  accessToken: string,
  lineupName: string,
  key: string
) => {
  const name = `ArtistLookup - ${lineupName} [${key}]`;
  const response_createPlaylist = await providerCreatePlaylist(
    accessToken,
    name,
    `Playlist created by ArtistLookup at ${timeStamp()}`
  );
  const { id } = response_createPlaylist.body;
  return id;
};

app.post("/createPlaylist", async (req: any, res: any) => {
  setCors(req, res);
  const { query } = url.parse(req.url);
  const { accessToken, trackId, lineupName, playlistId, lineupKey } =
    querystring.parse(query);
  try {
    const id =
      playlistId ?? (await createPlaylist(accessToken, lineupName, lineupKey));
    const params = (Array.isArray(trackId) ? trackId : [trackId]).map(
      (id: string) => `spotify:track:${id}`
    );
    replaceTracksInPlaylist(id, [], accessToken);
    // I guess that not more than x tracks can be added to a playlist at once
    for (let i = 0; i < params.length; i += 50) {
      const paramsSlice = params.slice(i, i + 50);
      await addTracksToPlaylist(accessToken, id, paramsSlice);
    }
    res.send({ playlistId: id });
    return;
  } catch (err: any) {
    console.log("Error when creating playlist.");
    console.log(err);
    res.send({ status: "error" });
    return;
  }
});

app.get("/festivals", async (req: any, res: any) => {
  setCors(req, res);
  res.send(
    Object.values(Festival).map((key) => {
      const string = readFileSync(
        join(process.cwd(), `src/data/${key}.json`),
        "utf8"
      );
      const lineup = JSON.parse(string);
      return {
        name: festivalNames[key],
        key,
        artists: lineup,
        additionalInformation: additionalInformation[key],
      };
    })
  );
  return;
});

app.get("/followed", async (req: any, res: any) => {
  setCors(req, res);
  const { query } = url.parse(req.url);
  const { accessToken } = querystring.parse(query);
  if (!accessToken) {
    res.status(401).send("No access token provided.");
    return;
  }
  try {
    res.send(await getFollowedArtists({ accessToken }));
    return;
  } catch (error: any) {
    console.log({ error, body: error.body });
    return;
  }
});
