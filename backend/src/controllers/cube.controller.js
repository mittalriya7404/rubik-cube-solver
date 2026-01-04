import {
  updateFace,
  updateCell,
  validateState,
  getSolution,
  resetCubeState
} from "../services/cube.service.js";

export const scanFace = (req, res, next) => {
  try {
    const { face, cells } = req.body;
    const data = updateFace(face, cells);
    res.json({ message: `${face} face updated`, faces: data });
  } catch (err) {
    next(err);
  }
};

export const editCell = (req, res, next) => {
  try {
    const { face, index, color } = req.body;
    const data = updateCell(face, index, color);
    res.json({ message: "Cell updated", faces: data });
  } catch (err) {
    next(err);
  }
};

export const validateCubeController = (req, res, next) => {
  try {
    validateState();
    res.json({ valid: true });
  } catch (err) {
    res.status(400);
    next(err);
  }
};

export const solveCubeController = (req, res, next) => {
  try {
    const solution = getSolution();
    res.json({ solution });
  } catch (err) {
    res.status(400);
    next(err);
  }
};

export const resetCube = (req, res, next) => {
  try {
    const data = resetCubeState();
    res.json({ message: "Cube reset", faces: data });
  } catch (err) {
    next(err);
  }
};
