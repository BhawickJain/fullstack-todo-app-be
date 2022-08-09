import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  addDummyDbItems,
  addDbItem,
  getAllDbItems,
  getDbItemById,
  DbItem,
  updateDbItemById,
  deleteDbItemById,
} from "./db";
import filePath from "./filePath";

// loading in some dummy items into the database
// (comment out if desired, or change the number)
addDummyDbItems(2);

const app = express();

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "your-project.herokuapp.com"
    : "localhost:4000";

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
dotenv.config();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

// GET /items
app.get("/items", (req, res) => {
  const allItems = getAllDbItems();
  res.status(200).json(allItems);
});

// POST /items
app.post<{}, {}, DbItem>("/items", (req, res) => {
  // to be rigorous, ought to handle non-conforming request bodies
  // ... but omitting this as a simplification
  const postData = req.body;
  const createdItem = addDbItem(postData);
  res.status(201).json(createdItem);
});

// GET /items/:id
app.get<{ id: string }>("/items/:id", (req, res) => {
  const matchingItem = getDbItemById(parseInt(req.params.id));
  if (matchingItem === "not found") {
    res.status(404).json(matchingItem);
  } else {
    res.status(200).json(matchingItem);
  }
});

// DELETE /items/:id
app.delete<{ id: string }>("/items/:id", (req, res) => {
  const matchingItem = deleteDbItemById(parseInt(req.params.id));
  if (matchingItem === "not found") {
    res.status(404).json(matchingItem);
  } else {
    res.status(200).json(matchingItem);
  }
});

// PATCH /items/:id
app.patch<{ id: string }, {}, Partial<DbItem>>("/items/:id", (req, res) => {
  const matchingItem = updateDbItemById(parseInt(req.params.id), req.body);
  if (matchingItem === "not found") {
    res.status(404).json(matchingItem);
  } else {
    res.status(200).json(matchingItem);
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
