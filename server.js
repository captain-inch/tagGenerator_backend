var express = require("express");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const { response } = require("express");
const Clarifai = require("clarifai");

const clarifaiApp = new Clarifai.App({
  apiKey: "e0c918f4d9e144a0b85687eedd9a4375",
});

var db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "mohelie",
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

// HOME
app.get("/", (req, resp) => {});

// SIGN-IN
app.post("/signin", (req, resp) => {
  console.log("Sign-in request received");
  db("login")
    .select("hash", "email")
    .where("email", "=", req.body.email.toLowerCase())
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        db("users")
          .select("*")
          .where("email", "=", req.body.email.toLowerCase())
          .then((user) => resp.json(user[0]))
          .catch((err) => resp.status(400).json("Error retrieving user"));
      } else {
        resp.status(400).json("Invalid password");
      }
    })
    .catch((err) => resp.status(400).json("Error, email not found"));
});

// REGISTERING A NEW USER
app.post("/register", (req, resp) => {
  console.log("Register request received");
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  let respData = null;
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email.toLowerCase(),
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        trx("users")
          .returning("*")
          .insert({
            username,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then((user) => {
            resp.json(user[0]);
          })
          .then(trx.commit);
      })
      .catch((err) => resp.status(400).json("Unable to register user"));
  });
});

// CHECKING USERNAME AVAILABILITY
app.post("/checkuseravailability", (req, resp) => {
  const { email, username } = req.body;
  let exists = { username: true, email: true };
  db.select("*")
    .from("users")
    .where({ email })
    .then((user) => {
      if (user.length) {
        exists.email = false;
        console.log("Email already exists");
      }
    })
    .then(() => {
      db.select("*")
        .from("users")
        .where({ username })
        .then((user) => {
          if (user.length) {
            exists.username = false;
            console.log("Username already exists");
          }
        })
        .then(() => resp.json(exists))
        .catch(() => resp.status(400).json("Error finding user availability"));
    });
});

// UPDATING RESULTS DATA
app.post("/submitresults", async (req, resp) => {
  console.log("Result submission request received");
  console.log("data :");
  console.log(req.body);
  let promises = [];
  req.body.forEach((tag) => {
    console.log("Starting .... ", tag);
    promises.push(db("results").select("tag").where({ tag }));
    console.log("Ending .... ", tag);
  });
  let requests = [];
  Promise.all(promises)
    .then((r) => {
      r.map((tag, index) => {
        if (tag.length) {
          console.log(tag, tag[0]);
          requests.push(db("results").where(tag[0]).increment("count", 1));
        } else {
          requests.push(db("results").insert({ tag: req.body[index] }));
        }
      });
    })
    .then(() => Promise.all(requests));
});

// GET TOP
app.post("/gettop", async (req, resp) => {
  console.log("Top results request received");
  const max = Number.isInteger(req.body.max) ? req.body.max : 10;
  db("results")
    .orderBy("count", "desc")
    .then((r) =>
      resp.json(
        r.slice(0, max).reduce((acc, data) => {
          acc.push(data.tag);
          return acc;
        }, [])
      )
    );
});

// GETTING USER INFO
app.get("/user/:id", (req, resp) => {
  console.log("User info request received");

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
// RETURN IMG API
app.post("/imageurl", async (req, resp) => {
  clarifaiApp.models
    .predict(Clarifai.GENERAL_MODEL, req.body.url)
    .then((data) => resp.json(data))
    .catch((err) => resp.status(400).json("Unable to communicate with API"));
});
// ADDING IMAGE COUNT
app.put("/image", (req, resp) => {
  console.log("Image count request received");
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      resp.json(entries[0]);
      console.log("Image count request perfomed");
    })
    .catch((err) => console.log(err));

  //   if (!userFound) {
  //     resp.status(400).json("User not found !");
  //   }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
