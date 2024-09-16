import request from 'supertest';
import {app} from '../src/app'

describe("lineups endpoint", () => {
    it("retuns all lineups", async () => {
        const res = await request(app).get(`/lineups`)
        expect(res.statusCode).toEqual(200)
        const expectedLineupKeys = ["fusion-2023", "tarmac-2022", "tomorrow-land-2023", "tarmac-2023"]
        res.body.forEach((lineup: any) => {
            expect(expectedLineupKeys.includes(lineup.key)).toBeTruthy()
        })
    })
})