import Cube from "cubejs";
import { buildFaceString } from "./cubeState.js";

Cube.initSolver();

export function solveCube() {
  const cube = Cube.fromString(buildFaceString());
  return cube.solve();
}
