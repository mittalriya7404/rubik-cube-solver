import { faces } from "../solver/faces.js";
import { validateCube } from "../solver/validator.js";
import { solveCube } from "../solver/solve.js";

export function updateFace(face, cells) {
  if (!faces[face]) throw new Error("Invalid face");
  if (!cells || cells.length !== 9) throw new Error("9 cells required");
  faces[face] = cells;
  return faces;
}

export function updateCell(face, index, color) {
  if (!faces[face]) throw new Error("Invalid face");
  if (index < 0 || index > 8) throw new Error("Invalid index");
  faces[face][index] = color;
  return faces;
}

export function validateState() {
  const error = validateCube();
  if (error) throw new Error(error);
  return true;
}

export function getSolution() {
  validateState();
  return solveCube();
}

export function resetCubeState() {
  Object.keys(faces).forEach(f => (faces[f] = Array(9).fill(f)));
  return faces;
}
