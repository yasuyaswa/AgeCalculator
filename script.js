let timer;

function start() {
  const dobValue = document.getElementById("dob").value;
  if (!dobValue) {
    alert("Please select date of birth");
    return;
  }

  const birth = new Date(dobValue);
  const nameInput = document.getElementById("name");
  const name = nameInput.value.trim();

  const nameDisplay = document.getElementById("nameDisplay");

  // ✅ Handle optional name correctly
  if (name) {
    nameDisplay.innerText = `Hello, ${name} 👋`;
    nameDisplay.classList.remove("hidden");
  } else {
    nameDisplay.innerText = "";
    nameDisplay.classList.add("hidden");
  }

  document.getElementById("tiles").classList.remove("hidden");
  document.getElementById("birthday").classList.remove("hidden");
  document.getElementById("exportBtn").classList.remove("hidden");

  if (timer) clearInterval(timer);
  update(birth);
  timer = setInterval(() => update(birth), 60000);
}

function update(birth) {
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();
  let hours = now.getHours() - birth.getHours();
  let minutes = now.getMinutes() - birth.getMinutes();

  if (minutes < 0) {
    minutes += 60;
    hours--;
  }

  if (hours < 0) {
    hours += 24;
    days--;
  }

  if (days < 0) {
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  document.getElementById("years").innerText = years;
  document.getElementById("months").innerText = months;
  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;

  updateNextBirthday(birth, now);
}

function updateNextBirthday(birth, now) {
  let nextBirthday = new Date(
    now.getFullYear(),
    birth.getMonth(),
    birth.getDate(),
    birth.getHours(),
    birth.getMinutes()
  );

  if (nextBirthday < now) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }

  const diff = nextBirthday - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("nextBirthday").innerText =
    `${days} days • ${hours} hours • ${minutes} minutes`;
}

function exportImage() {
  const capture = document.getElementById("capture");

  html2canvas(capture, { scale: 2 }).then(canvas => {
    const link = document.createElement("a");
    link.download = "age-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}
