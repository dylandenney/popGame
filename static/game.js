let score = 0;
let balloonSpeed = 1;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const balloonImage = new Image();
balloonImage.src = "static/balloon.png";

const popSound = new Audio("static/poper.wav");

class Balloon {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 40;
    this.height = 60;
    this.popped = false;
  }

  update() {
    this.y -= this.speed;
  }

  draw() {
    if (!this.popped) {
      ctx.drawImage(balloonImage, this.x, this.y, this.width, this.height);
    }
  }

  isClicked(x, y) {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }
}

let balloons = [];

function createBalloon() {
  const x = Math.random() * (canvas.width - 40);
  const y = canvas.height;
  const speed = balloonSpeed * (1 + Math.random() * 3);

  balloons.push(new Balloon(x, y, speed));
}

function update() {
  balloons.forEach((balloon) => {
    balloon.update();
  });

  balloons = balloons.filter((balloon) => !balloon.popped && balloon.y + balloon.height > 0);

  if (score >= 50 && score < 100) {
    balloonSpeed = 1.5;
  } else if (score >= 100) {
    balloonSpeed = 2;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  balloons.forEach((balloon) => {
    balloon.draw();
  });
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
  if (Math.random() < 0.02) {
    createBalloon();
  }

  update();
  draw();
  drawScore();

  requestAnimationFrame(gameLoop);
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', resizeCanvas);
  gameLoop();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function gameOver() {
  alert('Congratulations, you won! The game will restart.');
  location.reload();
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = balloons.length - 1; i >= 0; i--) {
    const balloon = balloons[i];

    if (balloon.isClicked(x, y)) {
      balloon.popped = true;
      const popSound = new Audio("static/pop.wav");
      popSound.currentTime = 0;
      popSound.play();
      score++;

      if (score >= 50 && score < 100) {
        balloon.speed += 1;
      } else if (score >= 100 && score < 150) {
        balloon.speed += 2;
      } else if (score >= 150) {
        gameOver();
      }
      break;
    }
  }
});

init();

