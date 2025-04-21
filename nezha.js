<style>
  body {
    margin: 0;
    overflow: hidden;
    background: #0f0f0f;
  }

  .pointer {
    width: 10px;
    height: 10px;
    background: radial-gradient(circle, #fff, transparent);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 100000;
    transform: translate(-50%, -50%);
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
</style>

<canvas id="clickCanvas"></canvas>
<span class="pointer" id="mousePointer"></span>

<script>
function clickEffect() {
  const canvas = document.getElementById("clickCanvas");
  const pointer = document.getElementById("mousePointer");
  const ctx = canvas.getContext("2d");
  let width, height;
  let multiplier = 0;
  let isLongPress = false;
  let longPressTimer;

  const colours = [
    "#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D", "#FF6B6B",
    "#FFD93D", "#6BCB77", "#4D96FF", "#843b62", "#f67e7d", "#ffb997"
  ];

  const balls = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  class Ball {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.r = Math.random() * 8 + 4;
      this.alpha = 1;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = (isLongPress ? 6 : 3) + Math.random() * (isLongPress ? 12 : 6);
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      const color1 = colours[Math.floor(Math.random() * colours.length)];
      const color2 = colours[Math.floor(Math.random() * colours.length)];
      this.gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      this.gradient.addColorStop(0, color1);
      this.gradient.addColorStop(1, color2);
      this.trail = [];
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, r: this.r });
      if (this.trail.length > 5) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.r *= 0.96;
      this.alpha -= 0.02;
    }

    draw(ctx) {
      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trail[i];
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fillStyle = this.gradient;
        ctx.globalAlpha = this.alpha * (i / this.trail.length);
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.closePath();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    isAlive() {
      return this.alpha > 0 && this.r > 0.5;
    }
  }

  function pushBalls(x, y, count) {
    for (let i = 0; i < count; i++) {
      balls.push(new Ball(x, y));
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, width, height);

    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];
      ball.update();
      ball.draw(ctx);
      if (!ball.isAlive()) balls.splice(i, 1);
    }

    if (isLongPress) {
      multiplier += 0.3;
    } else {
      multiplier *= 0.9;
    }

    requestAnimationFrame(animate);
  }

  // Events
  canvas.addEventListener("mousedown", e => {
    isLongPress = false;
    pushBalls(e.clientX, e.clientY, 20);
    longPressTimer = setTimeout(() => {
      isLongPress = true;
    }, 500);
  });

  canvas.addEventListener("mouseup", e => {
    clearTimeout(longPressTimer);
    if (isLongPress) {
      pushBalls(e.clientX, e.clientY, 50 + Math.floor(multiplier));
    }
    isLongPress = false;
  });

  canvas.addEventListener("mousemove", e => {
    pointer.style.left = e.clientX + "px";
    pointer.style.top = e.clientY + "px";
  });

  window.addEventListener("resize", resize);

  resize();
  animate();
}
clickEffect();
</script>
