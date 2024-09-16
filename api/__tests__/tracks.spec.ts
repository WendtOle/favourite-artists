const mockGetPlaylistTracks = jest.fn();
const mockgetMySavedTracks = jest.fn();

import request from "supertest";
import { app } from "../src/app";

jest.mock("../src/provider/getPlaylistTracks", () => ({
  getPlaylistTracks: mockGetPlaylistTracks,
}));
jest.mock("../src/provider/getMySavedTracks", () => ({
  getMySavedTracks: mockgetMySavedTracks,
}));

describe("tracks endpoint", () => {
  it("returns tracks", async () => {
    mockGetPlaylistTracks.mockImplementation(() => {
      console.log("mocked getPlaylistTracks");
      return [
        {
          track: {
            id: "DUMMY_TRACK_ID",
            name: "DUMMY_TRACK_NAME",
            artists: [{ name: "DUMMY_ARTIST_NAME", id: "DUMMY_ARTIST_ID" }],
            album: {
              name: "DUMMY_ALBUM_NAME",
              images: [{ url: "DUMMY_IMAGE_URL", height: 300 }],
            },
          },
        },
      ];
    });
    const res = await request(app).get(
      `/tracks?accessToken=dummy-access-token&playlistId=dummy-playlist-id&page=1`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        id: "DUMMY_TRACK_ID",
        name: "DUMMY_TRACK_NAME",
        artists: [{ name: "DUMMY_ARTIST_NAME", id: "DUMMY_ARTIST_ID" }],
        imageUrl: "DUMMY_IMAGE_URL",
        albumName: "DUMMY_ALBUM_NAME",
      },
    ]);
  });
});
