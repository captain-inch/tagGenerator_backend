var express = require("express");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
var db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "etienne",
    password: "",
    database: "tagGenerator",
  },
});

db.select("*")
  .from("users")
  .then((d) => console.log);
var app = express();
app.use(bodyParser.json());
app.use(cors());

headers = {
  Accept: "application/json, text/javascript, */*",
  "Content-Type": "application/x-www-form-urlencoded",
};
const database = {
  users: [
    {
      id: "123",
      username: "etienne",
      email: "etiennepousse@live.fr",
      password: "abcdefg",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      username: "Sally",
      email: "sally@gmail.com",
      password: "abcdefg",
      entries: 0,
      joined: new Date(),
    },
  ],
};

// HOME
app.get("/", (req, resp) => {
  console.log("This is working !");
  resp.json(database.users);
});

// SIGN-IN
app.post("/signin", (req, resp) => {
  console.log("Sign in request received !");
  let userFound = false;
  database.users.map((user) => {
    if (req.body.email === user.email && req.body.password === user.password) {
      resp.json(user);
      userFound = true;
    }
  });
  if (!userFound) {
    resp.status(400).json("Failed to login for user : " + req.body.email);
  }
});

// REGISTERING A NEW USER
app.post("/register", (req, resp) => {
  const { name, email, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      name,
      email,
      joined: new Date(),
    })
    .then((user) => {
      resp.json(user[0]);
    })
    .catch((err) => resp.status(400).json("Unable to register user"));
});

// GETTING USER INFO
app.get("/user/:id", (req, resp) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        resp.json(user[0]);
      } else {
        resp.status(400).json("User not found");
      }
    });
});

// ADDING IMAGE COUNT
app.put("/image", (req, resp) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      resp.json(entries[0]);
    })
    .catch((err) => console.log(err));

  //   if (!userFound) {
  //     resp.status(400).json("User not found !");
  //   }
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});
