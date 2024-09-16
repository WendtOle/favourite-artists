const mockCreatePlaylist = jest.fn();
const mockAddTracksToPlaylist = jest.fn();
const mockReplaceTracksInPlaylist = jest.fn();

import request from 'supertest';
import {app} from '../src/app'

jest.mock('../src/provider/createPlaylist', () => ({ createPlaylist: mockCreatePlaylist }))
jest.mock('../src/getCurrentTimeStamp', () => ({ timeStamp: jest.fn().mockReturnValue("08.07.23") }))
jest.mock('../src/provider/addTracksToPlaylist', () => ({ addTracksToPlaylist: mockAddTracksToPlaylist }))
jest.mock('../src/provider/replaceTracksInPlaylist', () => ({ replaceTracksInPlaylist: mockReplaceTracksInPlaylist }))

describe('createPlaylist endpoint', () => {
it('creates new playlist', async () => {
  mockCreatePlaylist.mockReturnValue({body: { id: "DUMMY_PLAYLIST_ID" }})
  const res = await request(app).post(`/createPlaylist?accessToken=dummy-access-token&trackId=song-id&lineupName=festival-xy&lineupKey=festival-xy`)

  expect(res.statusCode).toEqual(200)
  expect(mockCreatePlaylist).toHaveBeenCalledWith("dummy-access-token", "ArtistLookup - festival-xy [festival-xy]", "Playlist created by ArtistLookup at 08.07.23")
  expect(mockReplaceTracksInPlaylist).toHaveBeenCalledWith("DUMMY_PLAYLIST_ID", [], "dummy-access-token")
  expect(mockAddTracksToPlaylist).toHaveBeenCalledWith("dummy-access-token", "DUMMY_PLAYLIST_ID", ["spotify:track:song-id"])
})
})
