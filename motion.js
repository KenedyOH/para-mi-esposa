/* ===== CLASE POINT ===== */
var Point = (function () {
  function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  Point.prototype.clone = function () {
    return new Point(this.x, this.y);
  };

  return Point;
})();

/* ===== VARIABLES ===== */
let target = new Point(window.innerWidth / 2, window.innerHeight / 2);
let current = target.clone();

/* ===== CREAR CORAZÓN ===== */
const heart = document.createElement("div");
heart.className = "heart";
heart.innerText = "💖";
document.body.appendChild(heart);

/* ===== SEGUIR DEDO / MOUSE ===== */
function updateTarget(x, y) {
  target.x = x;
  target.y = y;
}

document.addEventListener("mousemove", e => {
  updateTarget(e.clientX, e.clientY);
});

document.addEventListener("touchmove", e => {
  const t = e.touches[0];
  updateTarget(t.clientX, t.clientY);
});

/* ===== ANIMACIÓN SUAVE ===== */
function animate() {
  // Copiamos la posición actual (no se rompe la animación)
  let next = current.clone();

  // Movimiento suave (interpolación)
  next.x += (target.x - next.x) * 0.1;
  next.y += (target.y - next.y) * 0.1;

  current = next;

  heart.style.left = current.x + "px";
  heart.style.top = current.y + "px";

  requestAnimationFrame(animate);
}

animate();
