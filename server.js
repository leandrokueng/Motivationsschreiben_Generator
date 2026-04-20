require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/generate", async (req, res) => {
  const { vorname, nachname, stelle, unternehmen, skills, motivation, extras, sprache, ton } = req.body;

  if (!vorname || !nachname || !stelle || !unternehmen || !skills || !motivation) {
    return res.status(400).json({ error: "Pflichtfelder fehlen." });
  }

  const prompt = `Schreibe ein ${ton}es Motivationsschreiben auf ${sprache} für folgende Person und Stelle:

Name: ${vorname} ${nachname}
Stelle: ${stelle}
Unternehmen: ${unternehmen}
Fähigkeiten & Kenntnisse: ${skills}
Motivation für diese Stelle/dieses Unternehmen: ${motivation}
${extras ? `Weitere Informationen: ${extras}` : ""}

Anforderungen:
- Vollständiges, druckfertiges Motivationsschreiben
- Professionelle Briefstruktur (Ort/Datum, Betreff, Anrede, Einleitung, Hauptteil, Schluss, Grussformel)
- Individuell auf die genannten Informationen zugeschnitten
- Nicht länger als eine A4-Seite
- Keine Platzhalter in eckigen Klammern verwenden – nutze stattdessen plausible, passende Formulierungen
- Nur den Brieftext ausgeben, keine Erklärungen davor oder danach`;

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: data.error?.message || "Gemini Fehler" });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
