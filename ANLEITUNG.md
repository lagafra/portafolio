# Portafolio M07 – Anleitung

## 1. Funktioniert die Idee?

**Ja, aber nicht so, wie man es zuerst vermutet.** Google Sites kann kein eigenes
Theme aus HTML/CSS/JS laden. Es gibt keinen Ort, an dem man Template-Dateien
hochlädt. Was Google Sites bietet, ist der Block **Einfügen → Einbetten**, und der
hat zwei Reiter:

| Reiter | Was er macht | Taugt für dieses Paket? |
|---|---|---|
| **Einbettungscode** | Eigenes HTML/CSS/JS wird in einen abgeschotteten iframe gepackt | Nur für kleine Snippets – ein komplettes Portfolio ist dafür zu groß |
| **Nach URL** | Bindet eine fremde Seite als iframe ein | **Ja – das ist der Weg** |

Die Seite lebt also auf einem eigenen (kostenlosen) Hosting, und Google Sites ist
nur noch der Rahmen, der laut Modulvorgabe verlangt wird. Das ist regelkonform:
im Modulblatt steht ausdrücklich, dass jedes geeignete digitale Werkzeug erlaubt
ist und Google Sites nur eine Empfehlung ist. Abgegeben wird ohnehin ein
einseitiges PDF mit dem **Link** zum eportfolio.

### Was dabei nicht geht – ehrlich vorab

- **Die Google-Sites-Kopfzeile bleibt sichtbar.** Sie lässt sich klein machen
  (Theme „Simple", weiß, Kopfzeilentyp „Nur Titel" oder Banner ohne Bild), aber
  nicht ganz entfernen. Das Design ist so gebaut, dass ein weißer Sites-Header
  darüber nicht stört.
- **Die iframe-Höhe ist fest.** Der eingebettete Bereich scrollt intern. Deshalb
  hat die Seite eine eigene Navigation und einen Lesefortschritt-Balken oben –
  beides ist genau für diese Situation gemacht.
- **Interne Sprungmarken ändern die Adresse der Elternseite nicht.** Ein Link auf
  „Muestra 3" funktioniert im iframe, lässt sich aber nicht extern verschicken.
- **Die Sites-interne Suche findet eingebetteten Inhalt nicht.** Für ein Portfolio
  irrelevant.

---

## 2. Einrichtung in fünf Schritten

### Schritt 1 – Inhalte einsetzen (ohne Quelltext)
Die Seite bringt einen eingebauten Bearbeitungsmodus mit – siehe Abschnitt 3.
Kurz: Adresse mit `#editar` am Ende öffnen, direkt auf der fertig gestalteten
Seite schreiben, am Ende **Descargar index.html** klicken. Es gibt aktuell
**145 rosa markierte Platzhalter**; ist nichts mehr rosa, fehlt nichts.

Wer lieber im Quelltext arbeitet, sucht dort nach `class="marcador"`.

### Schritt 2 – Eigene Medien einsetzen
Bilder, Video und Audio lassen sich ebenfalls im Bearbeitungsmodus tauschen.
Von Hand geht es so:

- **Bilder:** eigene Dateien nach `assets/img/` legen und im HTML den `src` ändern.
  Die vier mitgelieferten SVGs sind nur Attrappen und tragen unten rechts den
  Hinweis „IMAGEN DE EJEMPLO – SUSTITUIR".
- **Audio:** eigene Aufnahmen nach `assets/audio/` (die beiden mitgelieferten
  MP3s sind stumm). Format egal, `src` anpassen.
- **Video:** es gibt zwei Videoplätze. Das **Vorstellungsvideo** auf der
  Startseite ist bereits eingebaut (`assets/video/presentacion.mp4`, im
  Hochformat 9:16, mit Standbild aus Sekunde 1). Die **Unterrichtsaufzeichnung**
  in `Muestra 4` fehlt noch: dort den Block `<p class="video__aviso">…</p>` durch
  den iframe ersetzen, z. B.
  `<iframe src="https://www.youtube.com/embed/VIDEO-ID" title="Fragmento de la sesión" allowfullscreen loading="lazy"></iframe>`

### Schritt 3 – Hochladen
Den gesamten Ordner `portafolio/` auf einen statischen Host legen. Zwei einfache
Wege:

- **GitHub Pages** – Repository anlegen, Ordnerinhalt hochladen, unter
  *Settings → Pages* die Quelle auf den Branch stellen. Ergebnis:
  `https://benutzername.github.io/portafolio/`. Dauerhaft und kostenlos.
- **Netlify Drop** – Ordner auf die Seite ziehen, URL kommt sofort. Schneller,
  aber ohne Konto nur temporär.

Danach die URL im Browser öffnen und prüfen, ob alles lädt.

### Schritt 4 – In Google Sites einbetten
1. Neue Google-Sites-Seite anlegen, Theme möglichst neutral (weiß).
2. Kopfzeilentyp auf „Nur Titel" stellen.
3. **Einfügen → Einbetten → Nach URL** → eigene URL → **Ganze Seite**.
4. Den Block auf volle Seitenbreite ziehen und in der Höhe so weit aufziehen wie
   möglich (ca. 1200–1600 px sind angenehm).

Alternativ über **Einbettungscode** mit voller Kontrolle:

```html
<iframe src="https://benutzername.github.io/portafolio/"
        title="Portafolio de prácticas docentes M07"
        style="width:100%;height:1400px;border:0"></iframe>
```

> Bleibt der Bereich leer, blockiert der Host das Einbetten
> (`X-Frame-Options`). GitHub Pages und Netlify tun das nicht.

### Schritt 5 – Abgabe
Einseitiges PDF auf mySDI hochladen mit: persönlichen Daten, Modulname und
-nummer, Abgabedatum und **Link zum eportfolio** – und zwar zur Google-Sites-URL,
nicht zur Hosting-URL.

---

## 3. Bearbeiten ohne Quelltext

Die Seite hat einen eingebauten Bearbeitungsmodus. Er ist unsichtbar, solange man
ihn nicht ausdrücklich aufruft – Betreuerin und Prüfungsamt sehen nur die
fertige Seite.

**Aufrufen:** an die Adresse `#editar` anhängen, also
`https://…/index.html#editar` – oder, wenn die Datei lokal liegt, die Datei im
Browser öffnen und `#editar` hinter den Pfad schreiben. Beim ersten Aufruf
erscheint eine kurze Erklärung.

**Was dann geht:**

| | |
|---|---|
| Text ändern | Auf einen beliebigen Text klicken und schreiben. Enter erzeugt einen Zeilenumbruch, das Layout bleibt heil. Eingefügter Text kommt immer als reiner Text an – Word-Formatierungen können nichts zerstören. |
| Platzhalter abhaken | Die rosa Kästchen verlieren ihre Markierung automatisch, sobald der Text ersetzt ist. Unten links steht durchgehend, wie viele noch offen sind. |
| Bilder tauschen | Auf ein Bild klicken, Datei auswählen. Fotos werden vor dem Einbetten automatisch auf 1600 px verkleinert, damit die Datei nicht aufgebläht wird; danach fragt der Editor nach dem Alternativtext. |
| Video und Audio | Der Knopf unter dem jeweiligen Block fragt nach der Adresse. Endet sie auf `.mp4`, `.webm` oder `.mov`, entsteht ein direkt eingebundenes Video; bei YouTube- und Google-Drive-Links wird die richtige Einbettungsform erzeugt. Das gilt für beide Videoplätze: Vorstellungsvideo auf der Startseite und Unterrichtsaufzeichnung in Muestra 4. |
| Zeilen, Aufzählungspunkte, ganze Muestras | Hineinklicken – oben rechts erscheinen **Duplizieren** und **Löschen**. So entstehen weitere Tabellenzeilen oder eine fünfte Muestra, ohne HTML anzufassen. |
| Abschnitt umbenennen | Beim Ändern einer Überschrift schreibt sich der Eintrag im Inhaltsverzeichnis automatisch mit. |

**Speichern:** unten rechts **Descargar index.html**. Der Browser lädt eine
saubere Datei herunter – ohne Editor-Spuren, mit allen Änderungen. Diese Datei
ersetzt die veröffentlichte `index.html` (bei Netlify Drop: Ordner erneut
hineinziehen; bei GitHub: Datei ersetzen).

**Wichtig:** Der Browser speichert nichts von selbst auf dem Server. Solange
nicht heruntergeladen wurde, existieren die Änderungen nur im geöffneten Tab.
Unten links steht deshalb dauerhaft „cambios sin descargar", und beim Schließen
warnt der Browser. Zusätzlich legt der Editor eine Sicherheitskopie im Browser
ab; falls doch etwas schiefgeht, bietet er beim nächsten Aufruf an, sie als
`index-borrador.html` herunterzuladen.

**Grenzen, ehrlich:** neue Abschnitte anlegen, die Reihenfolge umstellen oder das
Design ändern geht damit nicht – dafür braucht es den Quelltext. Für das
Ausfüllen und Pflegen eines fertigen Portfolios reicht es vollständig.

Wenn sie später einmal ein richtiges Redaktionssystem möchte: **Publii** (Desktop-App,
schreibt statische Seiten und veröffentlicht direkt auf GitHub Pages oder Netlify)
oder **Decap CMS** wären die nächsten Schritte. Für dieses eine Portfolio wäre der
Einrichtungsaufwand allerdings größer als der Nutzen.

---

## 4. Fallstricke, die Punkte kosten können

- **Das Datum der letzten Bearbeitung muss im Portfolio sichtbar sein und darf
  nicht nach dem Abgabetermin liegen.** Es steht deshalb an zwei Stellen fest
  im HTML (Seitenleiste und Fußzeile) und wird **bewusst nicht** per JavaScript
  erzeugt: ein automatisches Datum würde beim Öffnen nach dem Abgabetermin ein zu
  spätes Datum anzeigen. Nach der Abgabe nichts mehr ändern.
- **Das Vorstellungsvideo liegt im Paket selbst.** Die Originaldatei hatte
  140 MB und wäre an GitHubs 100-MB-Grenze pro Datei gescheitert. Sie ist auf
  720 × 1280 und 19 MB umgerechnet (H.264/AAC, `faststart`, also
  streamingfähig) – bei einer Anzeigebreite von rund 260 px sichtbar
  verlustfrei. Das Original bitte trotzdem aufheben.
- **Datenschutz.** Auf einem öffentlichen Host ist alles öffentlich. Deshalb:
  keine Namen und keine erkennbaren Personen in den Dateien, das Video als „nicht
  gelistet" bzw. mit eingeschränktem Zugriff, und schriftliche Einwilligungen
  einholen. Die Seite trägt bereits `<meta name="robots" content="noindex">`.
- **Multimodalität ist ein eigenes Bewertungskriterium.** Text, Bild, Video *und*
  Audio müssen wirklich vorkommen – die Struktur hat für jedes einen Platz.
- **Quellenangaben.** Jede Abbildung hat eine `<span class="fuente">`-Zeile, und
  Abschnitt 06 sammelt Literatur und Medienrechte. Die Literaturliste enthält
  Standardwerke als Ausgangspunkt; sie muss an die tatsächlich zitierten Stellen
  angepasst und vor der Abgabe geprüft werden.
- **Grammatisches Geschlecht.** Die Texte sind weitgehend geschlechtsneutral
  formuliert („docente", „persona docente"). An den wenigen markierten Stellen
  bitte an die eigene Form anpassen.

---

## 5. Aufbau nach dem Bewertungsraster (40 Punkte)

| Kriterium | Punkte | Wo im Paket |
|---|---|---|
| Punto de partida | 7 | Startseite (Vorstellungsvideo) und Abschnitt 01: Ziele, Selbstbild, Vorerfahrung, Stärken/Sorgen, Audio-Reflexion |
| Observación de clases | 10 | Abschnitt 03: Stundenübersicht, Muestra 1 (Beobachtungsbogen), Muestra 2 (Soziogramm), je mit `anclaje teórico` |
| Impartición de clases | 10 | Abschnitt 04: Sitzungsübersicht, Muestra 3 (Planung + Material), Muestra 4 (Aufzeichnung + Dreifachvergleich + Tutor-Feedback) |
| Reflexión de cierre | 7 | Abschnitt 05: Selbstevaluation und Entwicklungsplan mit drei konkreten Vorhaben |
| Presentación del e-portfolio | 6 | Navigation, Lesefortschritt, Multimodalität, Quellen, sauberer Satz |

Zusätzlich ist Abschnitt 02 (Kontext des Praktikums) eingebaut. Er wird nicht
eigens bepunktet, macht die Muestras aber nachvollziehbar.

---

## 6. Dateien

```
portafolio/
├── index.html                 die Seite
├── ANLEITUNG.md               diese Datei
└── assets/
    ├── css/estilos.css        gesamtes Design
    ├── css/editor.css         Oberfläche des Bearbeitungsmodus
    ├── js/portafolio.js       Navigation, Fortschritt, Bildbetrachter
    ├── js/editor.js           Bearbeiten auf der gerenderten Seite
    ├── img/*.svg              vier Platzhalter-Abbildungen
    ├── img/presentacion-poster.jpg  Standbild des Vorstellungsvideos
    ├── video/presentacion.mp4 Vorstellungsvideo (19 MB, 9:16)
    └── audio/*.mp3            zwei stumme Platzhalter
```

Dazu `portafolio-archivo-unico.html`: dieselbe Seite als **eine einzige Datei**
(CSS, JS und Bilder eingebettet; Video und Audio bleiben extern und brauchen den
`assets`-Ordner daneben). Praktisch als Backup, zum Weitergeben oder für
den PDF-Ausdruck (`Strg+P` – dafür gibt es ein eigenes Druck-Stylesheet). Für das
Einbettungscode-Feld von Google Sites ist sie mit rund 100 KB zu groß.

---

## 7. Technisches

- Kein Framework, keine Build-Schritte, keine externen Abhängigkeiten außer den
  Schriften von Google Fonts (Fraunces, Karla, IBM Plex Mono). Fallen die aus,
  greifen systemeigene Ersatzschriften – das Layout bleibt stabil.
- Getestet mit Chromium bei 1280 px und 390 px Breite: kein horizontales
  Überlaufen, keine JS-Fehler, Navigation markiert in allen sechs Abschnitten den
  richtigen Eintrag. Der Bearbeitungsmodus wurde durchgespielt: Text ändern,
  Bild ersetzen (3000 px → 1600 px), Video- und Audioquelle tauschen, Zeile und
  Muestra duplizieren und löschen, Export – die heruntergeladene Datei enthält
  keine Editor-Reste und besteht dieselben Strukturprüfungen wie das Original.
- Barrierefreiheit: Sprungmarke zum Inhalt, sichtbarer Tastaturfokus,
  `alt`-Texte, scrollbare Tabellen mit Tastaturzugriff, `prefers-reduced-motion`
  wird respektiert.
- Farben: `--nieve #fcf7f8`, `--rosa-velo #f7e8ec`, `--rosa-linea #ecd0d8`,
  `--rosa #c0577a`, `--rosa-tinta #8a2e4c`, `--tinta #221a1d`. Alle zentral in
  `:root` – eine Änderung dort färbt die ganze Seite um.
