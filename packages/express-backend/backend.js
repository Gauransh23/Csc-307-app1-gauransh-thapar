// backend.js
import {
  addUser,
  findUserById,
  findUsersByName,
  findUsersByJob,
  findUsersByNameAndJob,
  findAllUsers,
  deleteUserById
} from "./services/user-service.js";

import dotenv from "dotenv";
import mongoose from "mongoose";

import express from "express";
import cors from "cors";

const users = {
  users_list: [
    { id: "xyz789", name: "Charlie", job: "Janitor" },
    { id: "abc123", name: "Mac", job: "Bouncer" },
    { id: "ppp222", name: "Mac", job: "Professor" },
    { id: "yat999", name: "Dee", job: "Aspring actress" },
    { id: "zap555", name: "Dennis", job: "Bartender" }
  ]
}; 


dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose.connection.on("connected", () => console.log("📡 mongoose event: connected"));
mongoose.connection.on("error", (e) => console.log("💥 mongoose event: error", e.message));
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const { name, job } = req.query;

  let promise;

  if (name && job) {
    promise = findUsersByNameAndJob(name, job);
  } else if (name) {
    promise = findUsersByName(name);
  } else if (job) {
    promise = findUsersByJob(job);
  } else {
    promise = findAllUsers();
  }

  promise
    .then((users) => res.send({ users_list: users }))
    .catch((err) => res.status(500).send(err.toString()));
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  findUserById(id)
    .then((user) => {
      if (!user) return res.status(404).send("Resource not found.");
      res.send(user);
    })
    .catch(() => res.status(400).send("Invalid id."));
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  deleteUserById(id)
    .then((deleted) => {
      if (!deleted) return res.status(404).send("Resource not found.");
      res.status(204).send();
    })
    .catch(() => res.status(400).send("Invalid id."));
});

app.post("/users", (req, res) => {
  addUser(req.body)
    .then((created) => res.status(201).send(created))
    .catch((err) => res.status(400).send(err.toString()));
});


app.post("/users/search", (req, res) => {
  const { name, job } = req.body;
  const result = findUsers({ name, job });
  res.send({ users_list: result });
});


app.post("/users/generate", (req, res) => {
  const userToAdd = req.body;
  const id = generateId();

  const newUser = { id, ...userToAdd };
  addUser(newUser);

  res.send(newUser);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

