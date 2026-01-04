import { faces } from "./faces.js";

export function buildFaceString() {
  return Object.values(faces).flat().join("");
}
