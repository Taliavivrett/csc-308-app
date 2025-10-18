import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.log("MongoDB connection error:", error));

const userSchema = new mongoose.Schema({
  name: String,
  job: String,
});

const userModel = mongoose.model("User", userSchema);
function addUser(user) {
  const newUser = new userModel(user);
  return newUser.save();
}

function getUsers() {
  return userModel.find();
}

function findUserById(id) {
  return userModel.findById(id);
}

function findUserByName(name) {
  return userModel.find({ name });
}

function findUserByJob(job) {
  return userModel.find({ job });
}

function findUserByNameAndJob(name, job) {
  return userModel.find({ name, job });
}

function deleteUserById(id) {
  return userModel.findByIdAndDelete(id);
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  let promise;

  if (name && job) {
    promise = findUserByNameAndJob(name, job);
  } else if (name) {
    promise = findUserByName(name);
  } else if (job) {
    promise = findUserByJob(job);
  } else {
    promise = getUsers();
  }

  promise
    .then((users) => res.send({ users_list: users }))
    .catch((error) => res.status(500).send({ message: error.message }));
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  addUser(userToAdd)
    .then((savedUser) => res.status(201).send(savedUser))
    .catch((error) => res.status(400).send({ message: error.message }));
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  findUserById(id)
    .then((user) => {
      if (user) res.send(user);
      else res.status(404).send({ message: "User not found" });
    })
    .catch((error) => res.status(500).send({ message: error.message }));
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  deleteUserById(id)
    .then((deletedUser) => {
      if (!deletedUser)
        return res.status(404).send({ message: "User not found" });
      res.status(204).send();
    })
    .catch((error) => res.status(500).send({ message: error.message }));
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  userModel
    .findByIdAndUpdate(id, { $set: updatedData }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser)
        return res.status(404).send({ message: "User not found" });
      res.send(updatedUser);
    })
    .catch((error) => res.status(500).send({ message: error.message }));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//const findUserByName = (name) => {
/* return users["users_list"].filter((user) => user["name"] === name);
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
  const randomId = Math.random().toString(36).substring(2, 10);
  userToAdd.id = randomId;
  addUser(userToAdd);
  res.status(201).send(userToAdd);
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
 */
