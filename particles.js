const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ===== CONFIG ===== */
const PARTICLES = 900;
const particles = [];
let mode = "heart"; // heart → text
let rotation = 0;

/* ===== POINT ===== */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  clone() {
    return new Point(this.x, this.y);
  }
}

/* ===== PARTICLE ===== */
class Particle {
  constructor(target) {
    this.pos = new Point(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    );
    this.base = target.clone();
    this.target = target.clone();
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 0.04 + 0.03;
    this.offset = Math.random() * Math.PI * 2;
  }

  update() {
    // Movimiento suave hacia el target
    this.pos.x += (this.target.x - this.pos.x) * this.speed;
    this.pos.y += (this.target.y - this.pos.y) * this.speed;

    // Vibración sutil (vida)
    this.offset += 0.05;
    this.pos.x += Math.sin(this.offset) * 0.3;
    this.pos.y += Math.cos(this.offset) * 0.3;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#4fc3ff";
    ctx.fill();
  }
}

/* ===== HEART SHAPE ===== */
function heart(t, scale) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return new Point(
    canvas.width / 2 + x * scale,
    canvas.height / 2 - y * scale
  );
}

/* ===== CREATE HEART ===== */
function createHeart() {
  particles.length = 0;
  const scale = Math.min(canvas.width, canvas.height) / 35;

  for (let i = 0; i < PARTICLES; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = heart(t, scale);
    particles.push(new Particle(p));
  }
}

/* ===== CREATE TEXT ===== */
function createText(text) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const fontSize = Math.min(canvas.width, canvas.height) / 6;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let i = 0;

  for (let y = 0; y < canvas.height; y += 6) {
    for (let x = 0; x < canvas.width; x += 6) {
      const idx = (y * canvas.width + x) * 4;
      if (data[idx + 3] > 150 && particles[i]) {
        particles[i].target = new Point(x, y);
        particles[i].base = particles[i].target.clone();
        i++;
      }
    }
  }
}

/* ===== ROTATING TRANSITION ===== */
function applyRotation() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  for (const p of particles) {
    const dx = p.base.x - cx;
    const dy = p.base.y - cy;

    p.target.x = cx + dx * Math.cos(rotation) - dy * Math.sin(rotation);
    p.target.y = cy + dx * Math.sin(rotation) + dy * Math.cos(rotation);
  }
}

/* ===== ANIMATE ===== */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (mode === "rotate") {
    rotation += 0.02;
    applyRotation();
  }

  for (const p of particles) {
    p.update();
    p.draw();
  }

  requestAnimationFrame(animate);
}

/* ===== START ===== */
createHeart();
animate();

/* ===== TIMELINE ===== */
setTimeout(() => {
  mode = "rotate";
}, 4000);

setTimeout(() => {
  mode = "text";
  rotation = 0;
  createText("TE AMO 💖"); // ← PUEDES PONER SU NOMBRE
}, 7000);
