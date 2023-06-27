
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
            .get("/api/not-an-endpoint")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not found")
            })
    })
})

describe("GET /api/articles/:article_id", () => {
    test("200: should respond with an article object which have the specific id", () => {
        return request(app)
            .get("/api/articles/2")
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toHaveProperty("article_id", 2);
                expect(article).toHaveProperty("author", expect.any(String));
                expect(article).toHaveProperty("title", expect.any(String));
                expect(article).toHaveProperty("body", expect.any(String));
                expect(article).toHaveProperty("topic", expect.any(String));
                expect(article).toHaveProperty("created_at", expect.any(String));
                expect(article).toHaveProperty("votes", expect.any(Number));
                expect(article).toHaveProperty("article_img_url", expect.any(String));
            })
    })
    test("400: Error - should return bad request when passing invalid article_id", () => {
        return request(app)
            .get("/api/articles/banana")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad Request" });
            })
    })
    test("404: Error - should return Not found when passing not existed article_id", () => {
        return request(app)
            .get("/api/articles/455")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Not found" });
            })
    })
})

describe("GET /api/articles", () => {
    test("200: should respond with an array of all articles", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeInstanceOf(Array);
                expect(articles).toHaveLength(13);
                articles.forEach((article) => {
                    expect(article).toHaveProperty("article_id", expect.any(Number));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).not.toHaveProperty("body");
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count", expect.any(String));
                })
                expect(articles).toBeSortedBy('created_at', { descending: true })
            })
    })
})

describe("/api/articles/:article_id/comments", () => {
    test("200: should respond with an array of comments for the given article_id ", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(11);
                comments.forEach(comment => {
                    expect(comment).toHaveProperty("comment_id", expect.any(Number));
                    expect(comment).toHaveProperty("votes", expect.any(Number));
                    expect(comment).toHaveProperty("created_at", expect.any(String));
                    expect(comment).toHaveProperty("author", expect.any(String));
                    expect(comment).toHaveProperty("body", expect.any(String));
                    expect(comment).toHaveProperty("article_id", expect.any(Number));
                })
            })
    })
    test("400: Error - should return bad request when passing invalid article_id", () => {
        return request(app)
            .get('/api/articles/car/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad Request" });
            })
    })
    test("200: should respond with an empty array when article has no comments", () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(0);
            })
    })
})