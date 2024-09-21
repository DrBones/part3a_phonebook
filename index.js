console.log("Phonebook Server");
import express from "express";
import { nanoid } from "nanoid";
import morgan from "morgan";

const app = express();

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:  ", request.path);
//   console.log("Body:  ", request.body);
//   console.log("---");
//   next();
// };
app.use(express.json());
// app.use(requestLogger);
morgan.token("type", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
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
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello, World!</h1><br/><h2>Phonebook Backend</h2>");
});

app.get("/info", (req, res) => {
  // YYYY-MM-DDTHH:mm:ss.sssZ
  const currentDate = new Date().toLocaleString();
  res.send(
    `<div> <p>This Phonebook has info for ${persons.length} people</p><p> ${currentDate} </p></div>`
  );
});

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.send(person);
  } else {
    res.statusMessage = "No Person with that id found";
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateID = () => {
  const maxID =
    persons.length > 0
      ? Math.max(...persons.map((person) => Number(person.id)))
      : 0;
  return String(maxID + 1);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "Name and Number are required" });
  }

  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({ error: "This Person already exists" });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: nanoid(),
  };
  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
