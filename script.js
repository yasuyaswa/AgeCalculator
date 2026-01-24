let timer;

function start() {
  const dobValue = document.getElementById("dob").value;
  if (!dobValue) return alert("Please select date of birth");

  const birth = new Date(dobValue);

  document.getElementById("tiles").classList.remove("hidden");
  document.getElementById("birthday").classList.remove("hidden");
  document.getElementById("exportBtn").classList.remove("hidden");

  if (timer) clearInterval(timer);
  update(birth);
  timer = setInterval(() => update(birth), 60000);
}

function update(birth) {
  const now = new Date();

  let y = now.getFullYear() - birth.getFullYear();
  let m = now.getMonth() - birth.getMonth();
  let d = now.getDate() - birth.getDate();
  let h = now.getHours() - birth.getHours();
  let min = now.getMinutes() - birth.getMinutes();

  if (min < 0) { min += 60; h--; }
  if (h < 0) { h += 24; d--; }
  if (d < 0) {
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    m--;
  }
  if (m < 0) { m += 12; y--; }

  document.getElementById("years").innerText = y;
  document.getElementById("months").innerText = m;
  document.getElementById("days").innerText = d;
  document.getElementById("hours").innerText = h;
  document.getElementById("minutes").innerText = min;

  updateNextBirthday(birth, now);
}

function updateNextBirthday(birth, now) {
  let next = new Date(
    now.getFullYear(),
    birth.getMonth(),
    birth.getDate(),
    birth.getHours(),
    birth.getMinutes()
  );

  if (next < now) next.setFullYear(next.getFullYear() + 1);

  const diff = next - now;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("nextBirthday").innerText =
    `${d} days • ${h} hours • ${m} minutes`;
}

function exportImage() {
  html2canvas(document.getElementById("capture"), { scale: 2 }).then(canvas => {
    const link = document.createElement("a");
    link.download = "age-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}
