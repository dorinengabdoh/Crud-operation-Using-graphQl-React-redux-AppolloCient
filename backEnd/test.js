const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const newApp = require("./dataBase");

//  unit test
describe("user test", () => {
  it("should get list of users", (done) => {
    request(newApp)
      .post("/graphql")
      .send({ query: "{ users { id first_name last_name } }" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.users).to.be.an("array");
        done();
      });
  });
});
