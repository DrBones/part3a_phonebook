console.log("Phonebook Server");
import "dotenv/config";
import express from "express";
import { nanoid } from "nanoid";
import morgan from "morgan";
import Person from "./models/person.js";

const app = express();

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };
app.use(express.json());
app.use(express.static("dist"));
// app.use(requestLogger);
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello, World!</h1><br/><h2>Phonebook Backend</h2>");
});

app.get("/info", (req, res) => {
  // YYYY-MM-DDTHH:mm:ss.sssZ
  const currentDate = new Date().toLocaleString();
  Person.find({}).then((persons) => {
    res.send(
      `<div> <p>This Phonebook has info for ${persons.length} people</p><p> ${currentDate} </p></div>`
    );
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.send(persons));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.send(person);
      } else {
        res.statusMessage = "No Person with that id found";
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "Name and Number are required" });
  }

  // if (persons.find((person) => person.name === body.name)) {
  //   return res.status(400).json({ error: "This Person already exists" });
  // }
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then((savedPerson) => res.json(savedPerson));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
