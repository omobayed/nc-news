
const app = require("../app")
const request = require("supertest")
const fs = require("fs/promises")

const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require("../db/data/test-data/index")

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
    test("200:should respond with an object describing all the available endpoints on the API ", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                fs.readFile('./endpoints.json', 'utf8')
                    .then((endpoints) => {
                        expect(body).toMatchObject(JSON.parse(endpoints))
                    })
            })
    })
})

describe("GET /api/topics", () => {
    test("200: should respond with an array of all topics", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
                expect(topics).toBeInstanceOf(Array);
                expect(topics).toHaveLength(3);
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty("description", expect.any(String));
                    expect(topic).toHaveProperty("slug", expect.any(String));
                })
            })
    })
})

describe("invalid route", () => {
    test("404: Error - responds with an error when the route is not exist", () => {
        return request(app)
            .get("/books")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found")
            })
    })
})