import { faces } from "./faces.js";

export function validateCube() {
  const all = Object.values(faces).flat();
  if (all.length !== 54) return "Invalid face count";

  const count = {};
  all.forEach((c) => (count[c] = (count[c] || 0) + 1));

  for (const c of ["U", "R", "F", "D", "L", "B"]) {
    if (count[c] !== 9) return `Color ${c} must appear 9 times`;
  }
  return null;
}
