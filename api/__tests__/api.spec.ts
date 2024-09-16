const mockCreateAuthorizeURL = jest.fn();
const mockGetTokens = jest.fn();
const mockCheckAccessTokenValid = jest.fn();
const mockGetRefreshedAccessToken = jest.fn();
const mockGetUserId = jest.fn();
const mockGetUserPlaylists = jest.fn();

import request from 'supertest';
import {app} from '../src/app'

jest.mock('../src/provider/createAuthorizeURL', () => ({ createAuthorizeURL: mockCreateAuthorizeURL }))
jest.mock('../src/provider/authorizeAPI', () => ({ getTokens: mockGetTokens }))
jest.mock('../src/provider/isAccessTokenValid', () => ({ checkAccessTokenValid: mockCheckAccessTokenValid }))
jest.mock('../src/provider/getRefreshedAccessToken', () => ({ getRefreshedAccessToken: mockGetRefreshedAccessToken }))
jest.mock('../src/provider/getUserId', () => ({ getUserId: mockGetUserId }))
jest.mock('../src/provider/getUserPlaylists', () => ({ getUserPlaylists: mockGetUserPlaylists }))

describe('Auth flow', () => {
it('sends authorization url', async () => {
  mockCreateAuthorizeURL.mockReturnValue("https://accounts.spotify.com/authorize")
  
  const res = await request(app).get('/authorizeURL')

  expect(res.statusCode).toEqual(200)
  expect(res.text).toEqual("https://accounts.spotify.com/authorize")
})
it('sends auth tokens', async () => {
  mockGetTokens.mockReturnValue({data: { 
    accessToken: "DUMMY_VALUE", 
    refreshToken: "DUMMY_VALUE"
  }})

  const res = await request(app).get(`/authenticate?code="DUMMY_VALUE"`)

  expect(res.statusCode).toEqual(200)
  expect(res.text).toEqual("{\"accessToken\":\"DUMMY_VALUE\",\"refreshToken\":\"DUMMY_VALUE\"}")
})
it('handles access token validity correctly', async () => {
  const accessToken = "DUMMY_VALUE"
  const res = await request(app)
  .get(`/accessTokenValid?accessToken=${accessToken}`)
  expect(res.statusCode).toEqual(200)
  expect(res.text).toEqual("ok")
})
it('handles general error correctly', async () => {
  mockCheckAccessTokenValid.mockImplementation(() => {throw new Error()})
  const accessToken = "DUMMY_VALUE"
  const res = await request(app)
  .get(`/accessTokenValid?accessToken=${accessToken}`)
  expect(res.statusCode).toEqual(200)
  expect(res.text).toEqual("error")
})
it('handles expired error correctly', async () => {
  mockCheckAccessTokenValid.mockImplementation(() => {throw {
    body: {
      error: {
        message: "The access token expired"
      }
    }
  };})
  const accessToken = "DUMMY_VALUE"
  const res = await request(app)
  .get(`/accessTokenValid?accessToken=${accessToken}`)
  expect(res.statusCode).toEqual(200)
  expect(res.text).toEqual("expired")
})
it('handles refreshing access token correctly', async () => {
  mockGetRefreshedAccessToken.mockReturnValue("DUMMY_REFESHED_VALUE")

  const accessToken = "DUMMY_VALUE"
  const res = await request(app).get(`/refresh?accessToken=${accessToken}`)

  expect(res.statusCode).toEqual(200)
  expect(res.text).toEqual("DUMMY_REFESHED_VALUE")
})
it('handles no playlists correctly', async () => {
  mockGetUserId.mockReturnValue("DUMMY_USER_ID")
  mockGetUserPlaylists.mockReturnValue([])

  const res = await request(app).get(`/playlists?accessToken=DUMMY_VALUE`)

  expect(res.statusCode).toEqual(200)
  expect(res.text).toEqual("{}")
})
it('returns playlists', async () => {
  mockGetUserId.mockReturnValue("DUMMY_USER_ID")
  mockGetUserPlaylists.mockReturnValue([{ images: [{ url: "" }], name: "", id: "", owner: { id: "DUMMY_USER_ID" }, tracks: { total: 10 }, snapshot_id: "" }])

  const res = await request(app).get(`/playlists?accessToken=DUMMY_VALUE`)

  expect(res.statusCode).toEqual(200)
  expect(res.text).toEqual("{\"\":{\"name\":\"\",\"id\":\"\",\"isOwn\":true,\"trackAmount\":10,\"snapShotId\":\"\",\"imageUrl\":\"\"}}")
})
})
