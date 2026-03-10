// backend.js
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

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};
const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
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

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const name = req.query.name;
  if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const wasDeleted = deleteUserById(id);

  if (!wasDeleted) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send(); // No Content
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const id = generateId();
  const newUser = { id, ...userToAdd };
  addUser(newUser);
  res.status(201).send(newUser);
});


app.post("/users/search", (req, res) => {
  const { name, job } = req.body;
  const result = findUsers({ name, job });
  res.send({ users_list: result });
});

// app.post("/users/delete", (req, res) => {
//   const { id } = req.body;
//   const wasDeleted = deleteUserById(id);

//   if (!wasDeleted) {
//     res.status(404).send("Resource not found.");
//   } else {
//     res.send();
//   }
// });

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

