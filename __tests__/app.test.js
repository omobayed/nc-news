
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
                expect(body).toEqual({ msg: "Article not found" });
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
                expect(comments).toBeSortedBy('created_at', { descending: true });
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
    test("404: Error - should return Not found when passing not existed article_id", () => {
        return request(app)
            .get("/api/articles/455/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Article not found" });
            })

    })
})

describe("POST: /api/articles/:article_id/comments", () => {
    test("201: should responds with added comment ", () => {
        const newComment = {
            username: "lurker",
            body: "This is a bad article name"
        };
        return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toHaveProperty("body", "This is a bad article name");
                expect(comment).toHaveProperty("votes", 0);
                expect(comment).toHaveProperty("comment_id", expect.any(Number));
                expect(comment).toHaveProperty("article_id", 3);
                expect(comment).toHaveProperty("author", "lurker");
                expect(comment).toHaveProperty("created_at", expect.any(String));
            })
    })

    test("201: should responds with ignoring unnecassery properties ", () => {
        const newComment = {
            username: "lurker",
            body: "This is a bad article name",
            image: "jpg"
        };
        return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toHaveProperty("body", "This is a bad article name");
                expect(comment).toHaveProperty("votes", 0);
                expect(comment).toHaveProperty("comment_id", expect.any(Number));
                expect(comment).toHaveProperty("article_id", 3);
                expect(comment).toHaveProperty("author", "lurker");
                expect(comment).toHaveProperty("created_at", expect.any(String));
            })
    })
    test("400: Error - should return bad request when passing invalid article_id", () => {
        const newComment = {
            username: "lurker",
            body: "This is a bad article name"
        };
        return request(app)
            .post('/api/articles/car/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad Request" });
            })
    })
    test("404: Error - should return Not found when passing not existed article_id", () => {
        const newComment = {
            username: "lurker",
            body: "This is a bad article name"
        };
        return request(app)
            .post("/api/articles/455/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Article not found" });
            })
    })
    test("404: Error - should return Not found when passing a comment with no username", () => {
        const newComment = {
            username: "non-user",
            body: "This is a bad article name"
        };
        return request(app)
            .post("/api/articles/3/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Key (author)=(non-user) is not present in table \"users\"." });
            })
    })
    test("400: Error - should return bad request when comment has no body property", () => {
        const newComment = {
            username: "lurker",
        };
        return request(app)
            .post('/api/articles/car/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad Request" });
            })
    })
    test("400: Error - should return bad request when comment has no username property", () => {
        const newComment = {
            body: "This is a bad article name"
        };
        return request(app)
            .post('/api/articles/car/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad Request" });
            })
    })
})

describe("PATCH:/api/articles/:article_id", () => {
    test("200 : should responds with an updated article ", () => {
        return request(app)
            .patch('/api/articles/3')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toHaveProperty("article_id", 3);
                expect(article).toHaveProperty("author", expect.any(String));
                expect(article).toHaveProperty("title", expect.any(String));
                expect(article).toHaveProperty("body", expect.any(String));
                expect(article).toHaveProperty("topic", expect.any(String));
                expect(article).toHaveProperty("created_at", expect.any(String));
                expect(article).toHaveProperty("votes", 1);
                expect(article).toHaveProperty("article_img_url", expect.any(String));
            })
    })
    test("400: Error - should return bad request when passing invalid article_id", () => {
        return request(app)
            .patch('/api/articles/car')
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad Request" });
            })
    })
    test("404: Error - should return Not found when passing not existed article_id", () => {
        return request(app)
            .patch("/api/articles/455")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Article not found" });
            })
    })
    test("400: Error - should return bad request when passing invalid inc_votes ", () => {
        return request(app)
            .patch('/api/articles/3')
            .send({ inc_votes: "car" })
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad Request" });
            })
    })
    test("400: Error - should return bad request when not passing inc_votes ", () => {
        return request(app)
            .patch('/api/articles/3')
            .send({ type: "non" })
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad Request" });
            })
    })
})
describe("DELETE:/api/comments/:comment_id", () => {
    test("204:should responds with status 204 no content  ", () => {
        return request(app)
            .delete('/api/comments/3')
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({})
            })
    })
    test("404: Error - should return Not found when passing valid but not existed comment_id", () => {
        return request(app)
            .delete("/api/comments/455")
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Comment not found" });
            })
    })
    test("400: Error - should return bad request when passing invalid comment_id ", () => {
        return request(app)
            .delete('/api/comments/car')
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: "Bad Request" });
            })
    })
})
describe("GET: /api/users", () => {
    test("200: should responds with all users", () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(users).toBeInstanceOf(Array);
                expect(users).toHaveLength(4);
                users.forEach((user) => {
                    expect(user).toHaveProperty("username", expect.any(String));
                    expect(user).toHaveProperty("name", expect.any(String));
                    expect(user).toHaveProperty("avatar_url", expect.any(String));
                })
            })
    })
})