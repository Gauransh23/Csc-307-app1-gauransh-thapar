// index.js
import express from "express";

const findUserByName = (name) => {
  return users.users_list.filter((user) => user.name === name);
};
const findUserById = (id) => {
  return users.users_list.find((user) => user.id === id);
};
const addUser = (user) => {
  users.users_list.push(user);
  return user;
};
const deleteUserById = (id) => {
  const index = users.users_list.findIndex((user) => user.id === id);
  if (index === -1) return false;
  users.users_list.splice(index, 1);
  return true;
};
const findUsers = ({ name, job }) => {
  return users.users_list.filter((user) => {
    if (name !== undefined && user.name !== name) return false;
    if (job !== undefined && user.job !== job) return false;
    return true;
  });
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
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.status(200).send();
});
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const deleted = deleteUserById(id);

  if (!deleted) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send(); // No Content is a nice REST choice for successful delete
  }
});
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  if (name !== undefined || job !== undefined) {
    const result = findUsers({ name, job });
    res.send({ users_list: result });
  } else {
    res.send(users);
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
