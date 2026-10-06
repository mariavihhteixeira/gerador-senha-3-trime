const $ = (id) => document.getElementById(id);

const lengthInput = $("length");
const lengthValue = $("lengthValue");
const passwordEl = $("password");
const chamber = document.querySelector(".chamber");
const particlesEl = $("particles");
const ambiguity = $("ambiguity");
const ambiguityText = $("ambiguityText");
const strengthIndicator = $("strengthIndicator");
const copyBtn = $("copyBtn");
const copyText = $("copyText");
const toast = $("toast");
const generateBtn = $("generateBtn");

const pools = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%&*+-_=?.:;"
};

const ambiguous = new Set(["0", "O", "o", "1", "I", "l", "|", "5", "S", "s", "2", "Z", "z", "8", "B"]);

function getPool() {
  let pool = "";
  if ($("lowercase").checked) pool += pools.lowercase;
  if ($("uppercase").checked) pool += pools.uppercase;
  if ($("numbers").checked) pool += pools.numbers;
  if ($("symbols").checked) pool += pools.symbols;

  if (!ambiguity.checked) {
    pool = [...pool].filter(ch => !ambiguous.has(ch)).join("");
  }
  return pool;
}

function secureRandom(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function randomFrom(pool) {
  return pool[secureRandom(pool.length)];
}

function generatePassword() {
  const length = Number(lengthInput.value);
  const selected = [
    $("lowercase").checked && pools.lowercase,
    $("uppercase").checked && pools.uppercase,
    $("numbers").checked && pools.numbers,
    $("symbols").checked && pools.symbols
  ].filter(Boolean);

  let pool = getPool();

  if (!pool || selected.length === 0) {
    passwordEl.textContent = "selecione opções";
    updateStrength(0, 0);
    return;
  }

  // Garante pelo menos um caractere de cada categoria escolhida.
  const chars = selected.map(category => {
    const filtered = ambiguity.checked
      ? category
      : [...category].filter(ch => !ambiguous.has(ch)).join("");
    return filtered ? randomFrom(filtered) : "";
  }).filter(Boolean);

  while (chars.length < length) {
    chars.push(randomFrom(pool));
  }

  // Fisher-Yates usando aleatoriedade criptográfica.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  const password = chars.slice(0, length).join("");
  animateGeneration(password);
}

function animateGeneration(finalPassword) {
  chamber.classList.add("generating");
  particlesEl.innerHTML = "";

  for (let i = 0; i < 20; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = `${10 + secureRandom(90)}%`;
    p.style.top = `${15 + secureRandom(70)}%`;
    p.style.setProperty("--dx", `${secureRandom(70) - 35}px`);
    p.style.setProperty("--dy", `${secureRandom(50) - 25}px`);
    p.style.animationDelay = `${secureRandom(400)}ms`;
    particlesEl.appendChild(p);
  }

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+-_=?.:;";
  let ticks = 0;
  const total = 10;

  const interval = setInterval(() => {
    passwordEl.textContent = Array.from({length: finalPassword.length}, () =>
      chars[secureRandom(chars.length)]
    ).join("");

    ticks++;
    if (ticks >= total) {
      clearInterval(interval);
      passwordEl.textContent = finalPassword;
      chamber.classList.remove("generating");
      updateStrength(finalPassword.length, getPool().length);
    }
  }, 65);
}

function updateStrength(length, poolSize) {
  if (!length) {
    strengthIndicator.style.left = "0%";
    return;
  }

  const types = [
    $("lowercase").checked,
    $("uppercase").checked,
    $("numbers").checked,
    $("symbols").checked
  ].filter(Boolean).length;

  // Estimativa visual simples: comprimento + variedade de caracteres.
  let score = (length - 6) * 8 + types * 14 + (poolSize > 65 ? 12 : 0);
  score = Math.max(5, Math.min(100, score));

  strengthIndicator.style.left = `${score}%`;
}

function updateLength() {
  lengthValue.textContent = lengthInput.value;
  const percentage = ((lengthInput.value - 6) / 6) * 100;
  lengthInput.style.background =
    `linear-gradient(to right, #ddd 0 ${percentage}%, #542525 ${percentage}% 100%)`;
}

function updateAmbiguity() {
  ambiguityText.textContent = ambiguity.checked ? "permitida" : "removida";
}

function copyPassword() {
  const value = passwordEl.textContent;
  if (!value || value === "selecione opções" || value === "Gerando...") return;

  navigator.clipboard.writeText(value).then(() => {
    copyText.textContent = "copiado";
    toast.classList.add("show");
    setTimeout(() => {
      copyText.textContent = "copiar";
      toast.classList.remove("show");
    }, 1300);
  });
}

[lengthInput, ambiguity, $("lowercase"), $("uppercase"), $("numbers"), $("symbols")]
  .forEach(el => el.addEventListener("change", () => {
    updateLength();
    updateAmbiguity();
    generatePassword();
  }));

lengthInput.addEventListener("input", updateLength);
copyBtn.addEventListener("click", copyPassword);
generateBtn.addEventListener("click", generatePassword);
passwordEl.addEventListener("click", generatePassword);

updateLength();
updateAmbiguity();
generatePassword();
