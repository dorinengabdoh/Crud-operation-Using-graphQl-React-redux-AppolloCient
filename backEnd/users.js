const express = require("express");
const db = require("./dataBase");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");

const User = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    birth_date: { type: GraphQLString },
    gender: { type: GraphQLString },
  }),
});

app.use(cors());

const endpoints = new GraphQLSchema({
  // get user
  query: new GraphQLObjectType({
    // query to get the All the user
    name: "Query",
    fields: {
      users: {
        type: new GraphQLList(User),
        resolve: (_, args) => {
          return new Promise((resolve, reject) => {
            db.all("SELECT * FROM users", (err, rows) => {
              if (err) {
                reject(err, "error");
              }
              resolve(rows);
            });
          });
        },
      },
      // get user with a specify according to the id
      user: {
        type: User,
        args: {
          id: { type: GraphQLID },
        },
        resolve: (_, args) => {
          return new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE id = ?", args.id, (err, row) => {
              if (err) {
                reject(null, err, "error");
              }
              resolve(row);
            });
          });
        },
      },
    },
  }),

  // when you don't query you doing a mutation ang here we can update, add, and delete
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      // add user
      addUser: {
        type: User,
        args: {
          first_name: { type: new GraphQLNonNull(GraphQLString) },
          last_name: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          birth_date: { type: new GraphQLNonNull(GraphQLString) },
          gender: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: (_, args) => {
          return new Promise((resolve, reject) => {
            db.run(
              "INSERT INTO users (first_name, last_name, email, birth_date, gender) VALUES (?, ?, ?, ?, ?)",
              [
                args.first_name,
                args.last_name,
                args.email,
                args.birth_date,
                args.gender,
              ],
              function (err) {
                if (err) {
                  reject(null, "error");
                }
                resolve({
                  id: this.lastID,
                  first_name: args.first_name,
                  last_name: args.last_name,
                  email: args.email,
                  birth_date: args.birth_date,
                  gender: args.gender,
                });
              }
            );
          });
        },
      },
      // edit the user
      editUser: {
        type: User,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          first_name: { type: new GraphQLNonNull(GraphQLString) },
          last_name: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          birth_date: { type: new GraphQLNonNull(GraphQLString) },
          gender: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: (_, args) => {
          return new Promise((resolve, reject) => {
            db.run(
              "UPDATE users SET first_name = ?, last_name = ?, email = ?, birth_date = ?, gender = ? WHERE id = ?",
              [
                args.first_name,
                args.last_name,
                args.email,
                args.birth_date,
                args.gender,
                args.id,
              ],
              function (err) {
                if (err) {
                  reject(null, "error");
                }
                resolve({
                  id: args.id,
                  first_name: args.first_name,
                  last_name: args.last_name,
                  email: args.email,
                  birth_date: args.birth_date,
                  gender: args.gender,
                });
              }
            );
          });
        },
      },

      // delete the user
      deleteUser: {
        type: User,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: (_, args) => {
          return new Promise((resolve, reject) => {
            db.run("DELETE FROM users WHERE id = ?", args.id, function (err) {
              if (err) {
                reject(null, "error");
              }
              resolve({ id: args.id });
            });
          });
        },
      },
    },
  }),
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: endpoints,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
