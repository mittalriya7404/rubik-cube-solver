/* COLORS */

const API_URL = "https://rubik-cube-solver-9r4l.onrender.com";

/* COLORS */
const COLORS = {
  U: "#ffffff",
  R: "#ff3b30",
  F: "#34c759",
  D: "#ffff00",
  L: "#ff9500",
  B: "#007aff",
};
const ORDER = ["U", "R", "F", "D", "L", "B"];
const LABEL = {
  U: "Up",
  R: "Right",
  F: "Front",
  D: "Down",
  L: "Left",
  B: "Back",
};

const faces = {},
  facesDiv = document.getElementById("faces"),
  result = document.getElementById("result");

/* ------- UI RENDERING ------- */
function renderFace(face) {
  faces[face] = Array(9).fill(face);

  const div = document.createElement("div");
  div.className = "face";
  div.innerHTML = `<h3>${LABEL[face]} (${face})</h3>`;

  const grid = document.createElement("div");
  grid.className = "grid";

  faces[face].forEach((c, i) => {
    const wrap = document.createElement("div");
    wrap.className = "cell-wrapper";
    const cell = document.createElement("div");
    cell.className = "cell";

    paint(cell, c);
    cell.onclick = () => togglePalette(wrap, face, i);

    wrap.appendChild(cell);
    grid.appendChild(wrap);
  });

  div.appendChild(grid);
  facesDiv.appendChild(div);
}

function updateFaceGrid(face) {
  const box = [...document.querySelectorAll(".face")].find((f) =>
    f.querySelector("h3").textContent.includes(face)
  );

  const grid = box.querySelector(".grid");

  [...grid.children].forEach((w, i) => {
    paint(w.querySelector(".cell"), faces[face][i]);
  });
}

/* ------- COLOR PICKER ------- */
function togglePalette(w, face, i) {
  const ex = w.querySelector(".palette");
  if (ex) return ex.remove();

  const pal = document.createElement("div");
  pal.className = "palette";

  Object.entries(COLORS).forEach(([k, c]) => {
    const btn = document.createElement("div");
    btn.className = "color-btn";
    btn.style.background = c;

    btn.onclick = () => {
      faces[face][i] = k;
      paint(w.querySelector(".cell"), k);
      pal.remove();
      syncFace(face);
      editCell(face, i, k);
    };

    pal.appendChild(btn);
  });

  w.appendChild(pal);
}

function paint(cell, c) {
  cell.style.background = COLORS[c] || "#fff";
  cell.textContent = c;
}

/* ------- BACKEND SYNC ------- */
function syncFace(face) {
  return fetch(`${API_BASE}/api/cube/scan-face`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ face, cells: faces[face] }),
  }).catch(() =>
    (result.textContent = "⚠️ Network error while syncing face")
  );
}

/* update single cell */
function editCell(face, index, value) {
  return fetch(`${API_BASE}/api/cube/edit-cell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ face, index, value }),
  });
}

function syncAll() {
  return Promise.all(ORDER.map(syncFace));
}

ORDER.forEach(renderFace);
syncAll();

/* ------- RESET ------- */
document.getElementById("resetBtn")?.addEventListener("click", () => {
  fetch(`${API_BASE}/api/cube/reset`, { method: "POST" })
    .then(() => {
      ORDER.forEach(renderFace);
      result.textContent = "Cube reset ✔️";
    })
    .catch(() => (result.textContent = "⚠️ Reset failed"));
});

/* ------- VALIDATE ------- */
document.getElementById("validateBtn").onclick = () => {
  syncAll().then(() => {
    fetch(`${API_BASE}/api/cube/validate`)
      .then(r => r.json())
      .then(d => {
        result.textContent = d.valid
          ? "Cube is valid 👍"
          : "❌ " + d.error;
      })
      .catch(() => (result.textContent = "⚠️ Validation request failed"));
  });
};

/* ------- SOLVE ------- */
function explain(m) {
  const f = LABEL[m[0]] + " face",
    x = m.slice(1);
  if (x === "2") return `Rotate the ${f} 180° (half turn)`;
  if (x == "'") return `Rotate the ${f} 90° counter-clockwise`;
  return `Rotate the ${f} 90° clockwise`;
}

document.getElementById("solveBtn").onclick = () => {
  syncAll().then(() => {
    fetch(`${API_BASE}/api/cube/solve`)
      .then(r => r.json())
      .then(d => {
        if (!d.solution) {
          result.textContent = "❌ " + (d.error || "Solve failed");
          return;
        }

        const moves = d.solution.trim().split(/\s+/);
        window.solutionMoves = moves;
        renderFullSolution(moves);
      })
      .catch(() => (result.textContent = "⚠️ Solve request failed"));
  });
};

function renderFullSolution(moves) {
  let html = `
  <div class="solution-box">
    <div class="solution-header">
      <div class="solution-title">Solution Instructions</div>
      <button class="step-btn" style="margin-left:auto" onclick="startStepMode()">
        ▶ Step-by-Step Mode
      </button>
    </div>
  `;

  moves.forEach((m, i) => {
    html += `
      <div class="step-line">
        Step ${i + 1}: <b>${m}</b> — ${explain(m)}
      </div>`;
  });

  html += `</div>`;
  result.innerHTML = html;
}

let stepIndex = 0;

function startStepMode() {
  stepIndex = 0;
  showStep();
}

function showStep() {
  const moves = window.solutionMoves;
  const move = moves[stepIndex];

  result.innerHTML = `
  <div class="solution-box">
    <div class="solution-title">Guided Solve Mode</div>

    <div class="step-counter">
      Step ${stepIndex + 1} of ${moves.length}
    </div>

    <div class="current-step">
      <b>${move}</b><br>
      ${explain(move)}
    </div>

    <div class="step-nav">
      <button class="step-btn" onclick="prevStep()" ${stepIndex===0 ? "disabled" : ""}>Previous</button>
      <button class="step-btn" onclick="nextStep()" ${stepIndex===moves.length-1 ? "disabled" : ""}>Next</button>
    </div>

    <div class="step-viewer">
      <button class="step-btn" onclick="renderFullSolution(window.solutionMoves)">Exit Step Mode</button>
    </div>
  </div>`;
}

function nextStep() { stepIndex++; showStep(); }
function prevStep() { stepIndex--; showStep(); }

/* ------- CAMERA LOGIC (unchanged) ------- */
const video = document.getElementById("camera");
const canvas = document.getElementById("snapshot");
const ctx = canvas.getContext("2d");
const guide = document.getElementById("guide");
const scanStatus = document.getElementById("scanStatus");
const faceSel = document.getElementById("faceSelect");
let stream = null;

document.getElementById("openCamBtn").onclick = openCamera;
document.getElementById("closeCamBtn").onclick = closeCamera;
document.getElementById("captureBtn").onclick = captureFace;

async function openCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.hidden = false;
    guide.hidden = false;
    canvas.hidden = true;
    scanStatus.textContent = "Align cube so stickers fit inside squares";
  } catch {
    scanStatus.textContent = "Camera permission denied ❌";
  }
}

function closeCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  video.hidden = true;
  canvas.hidden = true;
  guide.hidden = true;
  scanStatus.textContent = "Camera closed";
}

/* ------- COLOR DETECTION + CAPTURE (unchanged) ------- */
function detectColors() {
  const cell = canvas.width / 3;
  const res = [];
  const ref = {
    U: [255,255,255], R: [255,60,48], F: [52,199,89],
    D: [255,255,0], L: [255,149,0], B: [0,122,255],
  };

  function nearest(r,g,b){
    let best="U", min=1e9;
    for(const k in ref){
      const [x,y,z]=ref[k];
      const d=(r-x)**2+(g-y)**2+(b-z)**2;
      if(d<min){min=d;best=k;}
    }
    return best;
  }

  for(let r=0;r<3;r++){
    for(let c=0;c<3;c++){
      const x=c*cell+cell*0.25;
      const y=r*cell+cell*0.25;
      const d=ctx.getImageData(x,y,cell*0.5,cell*0.5).data;

      let R=0,G=0,B=0,n=0;
      for(let i=0;i<d.length;i+=4){
        R+=d[i]; G+=d[i+1]; B+=d[i+2]; n++;
      }
      res.push(nearest(R/n,G/n,B/n));
    }
  }
  return res;
}

function captureFace() {
  if (!stream) return scanStatus.textContent = "Open the camera first";

  canvas.hidden = false;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const face = faceSel.value;
  faces[face] = detectColors();

  updateFaceGrid(face);
  syncFace(face);

  scanStatus.textContent =
    `${LABEL[face]} face captured — colors auto-filled (edit if wrong)`;
}
