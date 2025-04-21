<style>
  .pointer {
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 100000;
    transform: translate(-50%, -50%);
  }
</style>

<script>
function clickEffect() {
  const balls = [];
  let isLongPressed = false;
  let longPressTimeout;
  let multiplier = 0;
  let width, height;
  let origin, normal;
  let ctx;

  const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");

  // Create pointer
  const pointer = document.createElement("span");
  pointer.className = "pointer";
  document.body.appendChild(pointer);

  // Resize canvas for high DPI
  function updateSize() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    origin = { x: width / 2, y: height / 2 };
    normal = { x: 0, y: 0 };
  }

  // Ball class
  class Ball {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.angle = Math.random() * 2 * Math.PI;
      this.multiplier = isLongPressed
        ? randBetween(14 + multiplier, 15 + multiplier)
        : randBetween(6, 12);
      this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
      this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
      this.r = randBetween(8, 12) + 3 * Math.random();
      this.color = colours[Math.floor(Math.random() * colours.length)];
    }

    update() {
      this.x += this.vx - normal.x;
      this.y += this.vy - normal.y;
      normal.x = -2 / window.innerWidth * Math.sin(this.angle);
      normal.y = -2 / window.innerHeight * Math.cos(this.angle);
      this.r -= 0.3;
      this.vx *= 0.9;
      this.vy *= 0.9;
    }

    draw(ctx) {
      if (this.r > 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    isAlive() {
      return this.r > 0 && this.x + this.r > 0 && this.x - this.r < width && this.y + this.r > 0 && this.y - this.r < height;
    }
  }

  function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function pushBalls(count, x, y) {
    for (let i = 0; i < count; i++) {
      balls.push(new Ball(x, y));
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    balls.forEach(ball => {
      ball.update();
      ball.draw(ctx);
    });
    // Remove dead balls
    for (let i = balls.length - 1; i >= 0; i--) {
      if (!balls[i].isAlive()) balls.splice(i, 1);
    }

    if (isLongPressed) {
      multiplier += 0.2;
    } else if (multiplier > 0) {
      multiplier -= 0.4;
    }

    requestAnimationFrame(loop);
  }

  function initEvents() {
    window.addEventListener("mousedown", (e) => {
      pushBalls(randBetween(10, 20), e.clientX, e.clientY);
      document.body.classList.add("is-pressed");
      longPressTimeout = setTimeout(() => {
        document.body.classList.add("is-longpress");
        isLongPressed = true;
      }, 500);
    });

    window.addEventListener("mouseup", (e) => {
      clearTimeout(longPressTimeout);
      if (isLongPressed) {
        document.body.classList.remove("is-longpress");
        pushBalls(randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)), e.clientX, e.clientY);
        isLongPressed = false;
      }
      document.body.classList.remove("is-pressed");
    });

    window.addEventListener("mousemove", (e) => {
      pointer.style.left = `${e.clientX}px`;
      pointer.style.top = `${e.clientY}px`;
    });

    window.addEventListener("resize", updateSize);
  }

  updateSize();
  initEvents();
  loop();
}
clickEffect();
</script>
