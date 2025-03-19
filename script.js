const pianoKeys = document.querySelectorAll(".piano-keys .key"); // Alle Klaviertasten auswählen

let allKeys = []; // Array zum Speichern aller Noten

let audio = new Audio(); // Neues Audio-Objekt erstellen

const playTune = (key) => {
    const note = allKeys.find(note => note.key === key); // Note für die angegebene Taste finden

    if (note) {
        audio.src = note.sound; // Audiodatei der Note zuweisen
        audio.play(); // Audiodatei abspielen
        const clickedKey = document.querySelector(`[data-key="${key}"]`); // Angegebene Taste auswählen
        clickedKey.classList.add("active"); // Klasse "active" zur Taste hinzufügen

        setTimeout(() => { 
            clickedKey.classList.remove("active"); // Klasse "active" nach 150ms entfernen
        }, 150);

    } else {
        console.log(`Note für Taste ${key} nicht gefunden`); // Fehlermeldung, wenn Note nicht gefunden wird
    }
}

const loadNotes = async () => {
    try {
        const response = await fetch('notes.json'); // Noten aus der JSON-Datei laden

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`); // Fehler werfen, wenn die Antwort nicht OK ist
        }

        const notes = await response.json(); // JSON-Antwort in ein Objekt umwandeln
        allKeys = notes; // Noten im allKeys-Array speichern
        console.log('Noten geladen:', allKeys); // Geladene Noten in der Konsole ausgeben

        pianoKeys.forEach(key => {
            const keyData = notes.find(note => note.key === key.dataset.key); // Notendaten für jede Taste finden

            if (keyData) {
                key.addEventListener("click", () => playTune(key.dataset.key)); // Klick-Event-Listener zur Taste hinzufügen
            } else {
                console.log(`Notendaten für Taste ${key.dataset.key} nicht gefunden`); // Fehlermeldung, wenn Notendaten nicht gefunden werden
            }
        });

        document.addEventListener("keydown", pressedKey); // Event-Listener für Tastendruck hinzufügen

    } catch (error) {
        console.error('Fehler beim Laden der Noten:', error); // Fehler beim Laden der Noten ausgeben
    }
}

const pressedKey = (e) => {
    console.log(`Taste gedrückt: ${e.key}`); // Gedrückte Taste in der Konsole ausgeben
    
    if (allKeys.some(note => note.key === e.key)) {
        console.log(`Spiele Melodie für Taste: ${e.key}`); // Melodie für die gedrückte Taste abspielen
        playTune(e.key);
    } else {
        console.log(`Taste ${e.key} nicht im allKeys-Array gefunden`); // Fehlermeldung, wenn Taste nicht gefunden wird
    }
}

function resetGame() {
    const allKeys = document.querySelectorAll('.piano-keys .key'); // Alle Klaviertasten auswählen
    allKeys.forEach(key => {
      key.classList.remove("active"); // Klasse "active" von allen Tasten entfernen
    });

    audio.pause(); // Audio pausieren
    audio.currentTime = 0; // Audio-Zeit auf 0 setzen
}

const resetButton = document.getElementById("resetBtn"); // Reset-Button auswählen
resetButton.addEventListener("click", resetGame); // Klick-Event-Listener zum Reset-Button hinzufügen

loadNotes(); // Noten laden