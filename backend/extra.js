// import express from "express";
// import cors from "cors";
// import { faces } from "./src/solver/faces.js";
// import { validateCube } from "./src/solver/validator.js";
// import { solveCube } from "./src/solver/solve.js";

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/scan-face", (req, res) => {
//   const { face, cells } = req.body;

//   if (!faces[face]) return res.status(400).json({ error: "Invalid face" });
//   if (!cells || cells.length !== 9)
//     return res.status(400).json({ error: "9 cells required" });

//   faces[face] = cells;
//   res.json({ message: `${face} face updated`, faces });
// });

// app.post("/edit-cell", (req, res) => {
//   const { face, index, color } = req.body;

//   if (!faces[face]) return res.status(400).json({ error: "Invalid face" });
//   if (index < 0 || index > 8)
//     return res.status(400).json({ error: "Invalid index" });

//   faces[face][index] = color;
//   res.json({ message: "Cell updated", faces });
// });

// app.get("/validate", (req, res) => {
//   const error = validateCube();
//   if (error) return res.status(400).json({ valid: false, error });
//   res.json({ valid: true });
// });

// app.get("/solve", (req, res) => {
//   const error = validateCube();
//   if (error) return res.status(400).json({ error });

//   try {
//     const solution = solveCube();
//     res.json({ solution });
//   } catch {
//     res.status(400).json({ error: "Invalid cube configuration" });
//   }
// });

// app.post("/reset", (req, res) => {
//   Object.keys(faces).forEach((f) => (faces[f] = Array(9).fill(f)));
//   res.json({ message: "Cube reset", faces });
// });

// app.listen(5000, () => console.log("Backend running at http://localhost:5000"));
