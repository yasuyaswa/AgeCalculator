let timer = null;
let confettiRAF = null;

/* ─── ZODIAC SIGN ─── */
function getZodiac(month, day) {
  const signs = [
    [120, "♑ Capricorn"], [219, "♒ Aquarius"], [320, "♓ Pisces"],
    [420, "♈ Aries"],    [521, "♉ Taurus"],   [621, "♊ Gemini"],
    [723, "♋ Cancer"],   [823, "♌ Leo"],       [923, "♍ Virgo"],
    [1023, "♎ Libra"],  [1122, "♏ Scorpio"],  [1222, "♐ Sagittarius"],
    [1232, "♑ Capricorn"]
  ];
  const md = month * 100 + day;
  return (signs.find(([cut]) => md <= cut) || signs[signs.length - 1])[1];
}

/* ─── DAY OF WEEK ─── */
function getDayName(date) {
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()];
}

/* ─── COUNT-UP ANIMATION ─── */
function animateCount(el, target) {
  const duration = 900;
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

/* ─── CONFETTI ─── */
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  const pieces = Array.from({ length: 130 }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height - canvas.height,
    w:  Math.random() * 11 + 5,
    h:  Math.random() * 7  + 3,
    r:  Math.random() * Math.PI * 2,
    dr: (Math.random() - 0.5) * 0.12,
    g:  Math.random() * 2.5 + 0.8,
    color: `hsl(${Math.random() * 360}, 88%, 62%)`
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.y += p.g;
      p.r += p.dr;
      if (p.y > canvas.height) { p.y = -p.h; p.x = Math.random() * canvas.width; }
    });
    confettiRAF = requestAnimationFrame(draw);
  }

  draw();
  setTimeout(() => {
    cancelAnimationFrame(confettiRAF);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 7000);
}

/* ─── SHAKE (validation feedback) ─── */
function shakeCard() {
  const card = document.querySelector(".card");
  card.style.animation = "none";
  void card.offsetHeight;
  card.style.animation = "shake 0.42s ease";

  const dob = document.getElementById("dob");
  dob.style.borderColor = "#f43f5e";
  dob.style.boxShadow   = "0 0 0 3px rgba(244,63,94,0.22)";
  setTimeout(() => { dob.style.borderColor = ""; dob.style.boxShadow = ""; }, 2200);
}

/* ─── START ─── */
function start() {
  const dobValue = document.getElementById("dob").value;
  if (!dobValue) { shakeCard(); return; }

  const birth = new Date(dobValue);
  if (isNaN(birth.getTime())) { shakeCard(); return; }

  const name = document.getElementById("name").value.trim();
  const nameDisplay = document.getElementById("nameDisplay");

  if (name) {
    nameDisplay.textContent = `✨ Hello, ${name}!`;
    nameDisplay.classList.remove("hidden");
  } else {
    nameDisplay.classList.add("hidden");
  }

  /* Chips */
  document.getElementById("zodiacChip").textContent  = getZodiac(birth.getMonth() + 1, birth.getDate());
  document.getElementById("bornDayChip").textContent = "🗓 Born on " + getDayName(birth);

  /* Show result */
  document.getElementById("resultSection").classList.remove("hidden");
  document.getElementById("exportBtn").classList.remove("hidden");

  /* Birthday today? */
  const now = new Date();
  if (now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate()) {
    launchConfetti();
  }

  /* Tick every second */
  if (timer) clearInterval(timer);
  update(birth, true);
  timer = setInterval(() => update(birth, false), 1000);
}

/* ─── UPDATE ─── */
function update(birth, animate) {
  const now = new Date();

  let yr = now.getFullYear() - birth.getFullYear();
  let mo = now.getMonth()    - birth.getMonth();
  let dy = now.getDate()     - birth.getDate();
  let hr = now.getHours()    - birth.getHours();
  let mn = now.getMinutes()  - birth.getMinutes();
  let sc = now.getSeconds()  - birth.getSeconds();

  if (sc < 0) { sc += 60; mn--; }
  if (mn < 0) { mn += 60; hr--; }
  if (hr < 0) { hr += 24; dy--; }
  if (dy < 0) { dy += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); mo--; }
  if (mo < 0) { mo += 12; yr--; }

  const vals = { years: yr, months: mo, days: dy, hours: hr, minutes: mn, seconds: sc };

  for (const [id, val] of Object.entries(vals)) {
    const el = document.getElementById(id);
    if (animate) {
      animateCount(el, val);
    } else {
      if (id === "seconds") {
        el.textContent = val;
        el.classList.remove("tick");
        void el.offsetHeight;
        el.classList.add("tick");
      } else {
        el.textContent = val;
      }
    }
  }

  /* Total days */
  const totalDays = Math.floor((now - birth) / 86400000);
  document.getElementById("totalDays").innerHTML =
    `You have lived <strong>${totalDays.toLocaleString()}</strong> days on Earth 🌍`;

  updateNextBirthday(birth, now);
}

/* ─── NEXT BIRTHDAY ─── */
function updateNextBirthday(birth, now) {
  let next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate(),
                      birth.getHours(), birth.getMinutes());
  if (next <= now) next.setFullYear(next.getFullYear() + 1);

  const diff = next - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);

  document.getElementById("nextBirthday").textContent =
    `${d} days  •  ${h} hours  •  ${m} min`;

  const last = new Date(next);
  last.setFullYear(last.getFullYear() - 1);
  const pct = Math.min(100, ((now - last) / (next - last)) * 100).toFixed(1);

  document.getElementById("birthdayProgress").style.width = `${pct}%`;
  document.getElementById("progressLabel").textContent = `${pct}% through the year`;
}

/* ─── EXPORT ─── */
function exportImage() {
  const capture = document.getElementById("capture");
  html2canvas(capture, { scale: 2, useCORS: true, backgroundColor: "#0a0a1a" }).then(canvas => {
    const link = document.createElement("a");
    link.download = "my-age-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}
