// index.js
import express from "express";

const findUserByName = (name) => {
  return users.users_list.filter((user) => user.name === name);
};
const findUserById = (id) => {
  return users.users_list.find((user) => user.id === id);
};

const app = express();
const port = 8000;

app.use(express.json());

app.get("/users", (req, res) => {
  const name = req.query.name;

  if (name !== undefined) {
    const result = findUserByName(name);
    res.send({ users_list: result });
  } else {
    res.send(users);
  }
});
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const result = findUserById(id);

  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const users = {
  users_list: [
    { id: "xyz789", name: "Charlie", job: "Janitor" },
    { id: "abc123", name: "Mac", job: "Bouncer" },
    { id: "ppp222", name: "Mac", job: "Professor" },
    { id: "yat999", name: "Dee", job: "Aspring actress" },
    { id: "zap555", name: "Dennis", job: "Bartender" }
  ]
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  res.send(users);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
