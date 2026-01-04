import { Router } from "express";
import {
  scanFace,
  editCell,
  validateCubeController,
  solveCubeController,
  resetCube
} from "../controllers/cube.controller.js";

const router = Router();

router.post("/scan-face", scanFace);
router.post("/edit-cell", editCell);
router.get("/validate", validateCubeController);
router.get("/solve", solveCubeController);
router.post("/reset", resetCube);

export default router;
