const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');

/*
  1. does it return the correct status code for the input provided?
  2. does it return the data in the expected format?
  3. does the data returned, if any, have the right content? 
*/

describe("POST /api/auth/register", () => {

  describe("create a new user in the database", () => {

    beforeEach(async () => {
      await db('devLib')
        .truncate()
      await db('users')
        .truncate()
    })

    it("should insert the user passed into the DB", async () => {
      const newUser = await request(server).post('/api/auth/register').send({username: "admin", password: "Test1!"})
      expect(newUser.body.username).toBe('admin');
    })

    it("Should insert the passed in user and respond with the status of 201", async () => {
      const newUser = await request(server).post('/api/auth/register').send({username: "admin", password: "Test1!"})
      expect(newUser.status).toBe(201);
    })

    it("should insert the user and return JSON data", async () => {
      const newUser = await request(server).post('/api/auth/register').send({username: "admin", password: "Test1!"})
      expect(newUser.type).toMatch(/json/i);
    })
  })
})

describe("POST /api/auth/login", () => {

  describe("login a user existing user", () => {

    beforeEach(async () => {
      await db('devLib')
        .truncate() 
      await db('users')
        .truncate()
     await request(server)
      .post('/api/auth/register')
      .send({username: "John Doe", password: 'TempPass1!'})
    })

    it("should login the user with a status of 200", async () => {
      const newUser = await request(server).post('/api/auth/login').send({username: "John Doe", password: 'TempPass1!'})
      expect(newUser.status).toBe(200);
    })

    it("should login the user and return a JSON data", async () => {
      const newUser = await request(server).post('/api/auth/login').send({username: "John Doe", password: 'TempPass1!'})
      expect(newUser.type).toMatch(/json/i);
    })


    it("should login the user and return a username, userId and token", async () => {
      const user = await request(server).post('/api/auth/login').send({username: "John Doe", password: 'TempPass1!'})
      expect(user.body.username).toMatch(/john doe/i);
      expect(user.body.userId).toBe(1);
      expect(user.body.token).not.toHaveLength(0);
    })
  })
})

describe("POST /api/devLib", () => {

  describe("Allow authenticated user to post a dev lib", () => {

    it("should post with a status of 201", async () => {
      const newPost = await request(server)
        .post('/api/devLib')
        .set({authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo0LCJ1c2VybmFtZSI6IkpvaG4gRG9lIEpyIEkiLCJpYXQiOjE1NzE2ODI3MzEsImV4cCI6MTU3MTc2OTEzMX0.lH3ZWovKLXoRoP5YtvVhXQ3so67hndgiDepMdGTt2EE"})
        .send({lib: "This is something", user_id: 1, category_id: 3})
      expect(newPost.status).toBe(201)
      
    })

    it("should login the user and return a JSON data", async () => {
      const newPost = await request(server)
        .post('/api/devLib')
        .set({authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo0LCJ1c2VybmFtZSI6IkpvaG4gRG9lIEpyIEkiLCJpYXQiOjE1NzE2ODI3MzEsImV4cCI6MTU3MTc2OTEzMX0.lH3ZWovKLXoRoP5YtvVhXQ3so67hndgiDepMdGTt2EE"})
        .send({lib: "This is something", user_id: 1, category_id: 3})
      expect(newPost.type).toMatch(/json/i);
    })


    it("should return the new post with a data key, and id, lib, user_id, and category_id", async () => {
      const newPost = await request(server)
        .post('/api/devLib')
        .set({authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo0LCJ1c2VybmFtZSI6IkpvaG4gRG9lIEpyIEkiLCJpYXQiOjE1NzE2ODI3MzEsImV4cCI6MTU3MTc2OTEzMX0.lH3ZWovKLXoRoP5YtvVhXQ3so67hndgiDepMdGTt2EE"})
        .send({lib: "This is something new new", user_id: 1, category_id: 3})
      expect(Object.keys(newPost.body.data)).toEqual([ 'id', 'lib', 'user_id', 'category_id' ])
    })
  })
})

// describe("GET /api/devLib", () => {

//   describe("allows a valid user to get all dev-libs from the databse", () => {

//     beforeEach(async () => {
//       await db('users')
//         .truncate()
//      await request(server)
//       .post('/api/auth/register')
//       .send({username: "John Doe", password: 'TempPass1!'})
//     })

//     it("should login the user with a status of 200", async () => {
//       const newUser = await request(server).post('/api/auth/login').send({username: "John Doe", password: 'TempPass1!'})
//       expect(newUser.status).toBe(200);
//     })

//     it("should login the user and return a JSON data", async () => {
//       const newUser = await request(server).post('/api/auth/login').send({username: "John Doe", password: 'TempPass1!'})
//       expect(newUser.type).toMatch(/json/i);
//     })


//     it("should login the user and return a username, userId and token", async () => {
//       const user = await request(server).post('/api/auth/login').send({username: "John Doe", password: 'TempPass1!'})
//       expect(user.body.username).toMatch(/john doe/i);
//       expect(user.body.userId).toBe(1);
//       expect(user.body.token).not.toHaveLength(0);
//     })
//   })
// })