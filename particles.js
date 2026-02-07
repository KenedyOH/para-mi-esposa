const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const PARTICLE_COUNT = 900;
let phase = 0; // 0 = corazón, 1 = nombre

/* ===== CLASE POINT ===== */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  clone() {
    return new Point(this.x, this.y);
  }
}

/* ===== PARTÍCULA ===== */
class Particle {
  constructor(x, y) {
    this.pos = new Point(Math.random() * canvas.width, Math.random() * canvas.height);
    this.target = new Point(x, y);
    this.speed = Math.random() * 0.05 + 0.03;
    this.size = Math.random() * 2 + 1;
  }

  move() {
    this.pos.x += (this.target.x - this.pos.x) * this.speed;
    this.pos.y += (this.target.y - this.pos.y) * this.speed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#3dbbff";
    ctx.fill();
  }
}

/* ===== GENERAR CORAZÓN ===== */
function heartShape(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return new Point(
    canvas.width / 2 + x * 15,
    canvas.height / 2 - y * 15
  );
}

/* ===== CREAR PARTÍCULAS ===== */
function createHeart() {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = heartShape(t);
    particles.push(new Particle(p.x, p.y));
  }
}

/* ===== FORMAR TEXTO ===== */
function createText(text) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 120px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let index = 0;

  for (let y = 0; y < canvas.height; y += 6) {
    for (let x = 0; x < canvas.width; x += 6) {
      const i = (y * canvas.width + x) * 4;
      if (imageData[i + 3] > 150 && particles[index]) {
        particles[index].target = new Point(x, y);
        index++;
      }
    }
  }
}

/* ===== ANIMACIÓN ===== */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.move();
    p.draw();
  }

  requestAnimationFrame(animate);
}

/* ===== INICIO ===== */
createHeart();
animate();

/* ===== CAMBIO DE FORMA ===== */
setTimeout(() => {
  phase = 1;
  createText("TE AMO 💖"); // ← AQUÍ CAMBIA EL NOMBRE
}, 6000);
