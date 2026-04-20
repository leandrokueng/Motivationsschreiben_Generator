const form = document.getElementById("form");
const generateBtn = document.getElementById("generateBtn");
const btnText = document.getElementById("btnText");
const btnSpinner = document.getElementById("btnSpinner");
const resultEl = document.getElementById("result");
const errorBox = document.getElementById("errorBox");
const copyBtn = document.getElementById("copyBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    vorname: document.getElementById("vorname").value.trim(),
    nachname: document.getElementById("nachname").value.trim(),
    stelle: document.getElementById("stelle").value.trim(),
    unternehmen: document.getElementById("unternehmen").value.trim(),
    skills: document.getElementById("skills").value.trim(),
    motivation: document.getElementById("motivation").value.trim(),
    extras: document.getElementById("extras").value.trim(),
    sprache: document.getElementById("sprache").value,
    ton: document.getElementById("ton").value,
  };

  setLoading(true);
  clearError();
  resultEl.textContent = "";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error || `Fehler: ${response.status}`);
      return;
    }

    resultEl.textContent = data.text;
  } catch (err) {
    showError("Netzwerkfehler: " + err.message);
  } finally {
    setLoading(false);
  }
});

copyBtn.addEventListener("click", () => {
  const text = resultEl.textContent;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 15 4 10"></polyline></svg> Kopiert!`;
    copyBtn.classList.add("copied");
    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.classList.remove("copied");
    }, 2000);
  });
});

function setLoading(on) {
  generateBtn.disabled = on;
  btnText.textContent = on ? "Generiere..." : "Motivationsschreiben generieren";
  btnSpinner.classList.toggle("hidden", !on);
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}
