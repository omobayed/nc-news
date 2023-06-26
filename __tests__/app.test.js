
const app = require("../app")
const request = require("supertest")

const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require("../db/data/test-data/index")

beforeAll(() => seed(data));
afterAll(() => db.end());

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