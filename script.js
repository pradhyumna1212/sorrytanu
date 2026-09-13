// ============================================================
// Sorry Tanu Agarwal — interactive romantic apology webapp
// ============================================================

// ---------- Floating Hearts Canvas Background ----------
const canvas = document.getElementById('hearts-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Heart {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : height + 20;
    this.size = 8 + Math.random() * 18;
    this.speed = 0.4 + Math.random() * 1.2;
    this.drift = (Math.random() - 0.5) * 0.6;
    this.opacity = 0.15 + Math.random() * 0.5;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.02;
    this.hue = 330 + Math.random() * 30;
  }

  update() {
    this.y -= this.speed;
    this.x += this.drift;
    this.angle += this.spin;
    if (this.y < -30) this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `hsl(${this.hue}, 85%, 70%)`;
    const s = this.size;
    ctx.beginPath();
    ctx.moveTo(0, s / 4);
    ctx.bezierCurveTo(s / 2, -s / 2, s * 1.2, s / 3, 0, s);
    ctx.bezierCurveTo(-s * 1.2, s / 3, -s / 2, -s / 2, 0, s / 4);
    ctx.fill();
    ctx.restore();
  }
}

const hearts = Array.from({ length: 45 }, () => new Heart());

function animateHearts() {
  ctx.clearRect(0, 0, width, height);
  hearts.forEach(h => { h.update(); h.draw(); });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// ---------- Confetti / burst effect ----------
function burstHearts(x, y, count = 24) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'burst-heart';
    el.textContent = ['💖', '💕', '💗', '✨', '🌸'][Math.floor(Math.random() * 5)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 160;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    el.style.cssText = `
      position: fixed; left:${x}px; top:${y}px; font-size:${16 + Math.random()*18}px;
      pointer-events:none; z-index: 999; transform: translate(-50%,-50%);
      transition: transform 1.1s cubic-bezier(.2,.8,.2,1), opacity 1.1s ease;
      opacity: 1;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${tx - 50}%, ${ty - 50}%) scale(0.4) rotate(${Math.random()*360}deg)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 1200);
  }
}

// ---------- Stage navigation ----------
const stageEnvelope = document.getElementById('stage-envelope');
const stageLetter = document.getElementById('stage-letter');
const stageJourney = document.getElementById('stage-journey');
const stageMemories = document.getElementById('stage-memories');
const stageApology = document.getElementById('stage-apology');
const stageQuestion = document.getElementById('stage-question');
const stageFinal = document.getElementById('stage-final');
const envelope = document.getElementById('envelope');

function showStage(el) {
  document.querySelectorAll('.stage').forEach(s => s.classList.add('hidden'));
  el.classList.remove('hidden');
}

// ---------- Envelope open ----------
envelope.addEventListener('click', (e) => {
  envelope.classList.add('open');
  burstHearts(e.clientX, e.clientY, 18);
  setTimeout(() => {
    showStage(stageLetter);
    startTypewriter();
  }, 650);
});

// ---------- Typewriter effect ----------
const message =
  "My dearest Tanu,\n\nI know I made a mistake, and I'm truly, deeply sorry. " +
  "You mean so much to me, and seeing you upset breaks my heart. " +
  "Please let these words reach you the way I mean them — honestly and with love.";

const typewriterEl = document.getElementById('typewriter');
let twIndex = 0;
let twStarted = false;

function startTypewriter() {
  if (twStarted) return;
  twStarted = true;
  typewriterEl.textContent = '';
  const interval = setInterval(() => {
    typewriterEl.textContent += message[twIndex];
    twIndex++;
    if (twIndex >= message.length) {
      clearInterval(interval);
      typewriterEl.style.borderRight = 'none';
    }
  }, 28);
}

// ---------- Continue through Our Journey → Our Memories → Question ----------
document.getElementById('continue-btn').addEventListener('click', (e) => {
  burstHearts(e.clientX, e.clientY, 14);
  showStage(stageJourney);
});

document.getElementById('journey-continue-btn').addEventListener('click', (e) => {
  burstHearts(e.clientX, e.clientY, 14);
  showStage(stageMemories);
});

document.getElementById('memories-continue-btn').addEventListener('click', (e) => {
  burstHearts(e.clientX, e.clientY, 14);
  showStage(stageApology);
});

document.getElementById('apology-continue-btn').addEventListener('click', (e) => {
  burstHearts(e.clientX, e.clientY, 14);
  showStage(stageQuestion);
});

// ---------- "No" button runs away ----------
const noBtn = document.getElementById('no-btn');
const btnRow = document.getElementById('btn-row');

function moveNoButton() {
  const rowRect = btnRow.getBoundingClientRect();
  const maxX = Math.max(0, rowRect.width - noBtn.offsetWidth);
  const maxY = 40;
  const randX = (Math.random() - 0.5) * 2 * maxX * 0.9;
  const randY = (Math.random() - 0.5) * 2 * maxY;
  noBtn.style.position = 'relative';
  noBtn.style.left = `${randX}px`;
  noBtn.style.top = `${randY}px`;
}

noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('click', moveNoButton);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); });

// ---------- "Yes" button — celebration ----------
document.getElementById('yes-btn').addEventListener('click', (e) => {
  burstHearts(e.clientX, e.clientY, 40);
  setTimeout(() => {
    showStage(stageFinal);
    launchConfettiRain();
  }, 500);
});

// ---------- Confetti rain for final celebration ----------
function launchConfettiRain() {
  const emojis = ['💖', '🎉', '💕', '✨', '🌸', '💗'];
  let count = 0;
  const rain = setInterval(() => {
    const el = document.createElement('div');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position: fixed; top: -40px; left: ${Math.random() * 100}vw;
      font-size: ${16 + Math.random() * 20}px; z-index: 999;
      pointer-events: none; opacity: .9;
      transition: transform 3.2s linear, opacity 3.2s linear;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translateY(${window.innerHeight + 80}px) rotate(${Math.random()*360}deg)`;
      el.style.opacity = '0.1';
    });
    setTimeout(() => el.remove(), 3300);
    count++;
    if (count > 60) clearInterval(rain);
  }, 120);
}
