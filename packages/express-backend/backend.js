import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

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

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd);
  res.status(201).json(addedUser)
});

const deleteUserById = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index !== -1) {
    users["users_list"].splice(index, 1);
    return true;
  }
  return false;
};

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const deleted = deleteUserById(id);
  if (deleted) {
    res.status(200).send(`User with id ${id} deleted.`);
  } else {
    res.status(404).send("User not found.");
  }
});

const findUsersByFilters = (name, job) => {
  return users["users_list"].filter((user) => {
    const matchesName = name ? user["name"] === name : true;
    const matchesJob = job ? user["job"] === job : true;
    return matchesName && matchesJob;
  });
};

app.get("/filtered-users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  let result = findUsersByFilters(name, job);
  result = { users_list: result };
  res.send(result);
});
