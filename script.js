document.addEventListener("DOMContentLoaded", () => {
    const profileResult = document.getElementById("profileResult");
    const colorCheckboxes = document.querySelectorAll(".color-checkbox");
    const copyButton = document.getElementById("copyButton");
  
    // Erstelle das Farbzähler-Element
    const colorCounter = document.createElement("div");
    colorCounter.className = "color-counter";
    // Füge es nach der dark-colors Kategorie ein
    document.querySelector(".dark-colors").after(colorCounter);
  
    // Farbzuordnungen
    const colorMapping = {
      athleticHeather: "grau",
      black: "schwarz",
      brown: "braun",
      maroon: "weinrot",
      orange: "orange",
      pink: "pink",
      royalBlue: "blau",
      softCream: "soft",
      white: "weiß",
    };
  
    // Profile mit ihren Farbregeln
    const profiles = {
      A: {
        name: "A - alle Farben",
        colors: ["grau", "pink", "orange", "blau", "soft", "schwarz", "weinrot", "braun", "weiß"],
      },
      B: {
        name: "B - weiß, pink, orange, grau, blau, soft",
        colors: ["weiß", "pink", "orange", "grau", "blau", "soft"],
      },
      C: {
        name: "C - pink, weiß, grau, soft",
        colors: ["pink", "weiß", "grau", "soft"],
      },
      D: {
        name: "D - grau, pink, orange, blau",
        colors: ["grau", "pink", "orange", "blau"],
      },
      E: {
        name: "E - orange, weiß, blau, grau, soft, schwarz, weinrot, braun",
        colors: ["orange", "weiß", "blau", "grau", "soft", "schwarz", "weinrot", "braun"],
      },
      F: {
        name: "F - weiß, schwarz, pink, weinrot, grau, braun, blau, soft",
        colors: ["weiß", "schwarz", "pink", "weinrot", "grau", "braun", "blau", "soft"],
      },
      G: {
        name: "G - pink, orange, weiß, grau, soft",
        colors: ["pink", "orange", "weiß", "grau", "soft"],
      },
      H: {
        name: "H - weiß, orange, weinrot, schwarz, braun, blau",
        colors: ["weiß", "orange", "weinrot", "schwarz", "braun", "blau"],
      },
      I: {
        name: "I - orange, weinrot, schwarz, braun, blau",
        colors: ["orange", "weinrot", "schwarz", "braun", "blau"],
      },
      J: {
        name: "J - pink, orange, blau, grau, schwarz, weinrot, braun",
        colors: ["pink", "orange", "blau", "grau", "schwarz", "weinrot", "braun"],
      },
      K: {
        name: "K - braun, weinrot, schwarz, grau, weiß, soft",
        colors: ["braun", "weinrot", "schwarz", "grau", "weiß", "soft"],
      },
      L: {
        name: "L - soft, weiß, pink, grau, ",
        colors: ["soft", "weiß", "pink", "grau"],
      },
      M: {
        name: "M - soft, weiß, pink, grau, blau",
        colors: ["soft", "weiß", "pink", "grau", "blau"],
      },
    };
  
    // Funktion zum Aktualisieren des Copy-Buttons
    function updateCopyButton(matchedProfiles) {
      if (matchedProfiles && matchedProfiles.length > 0) {
        copyButton.disabled = false;
        
        // Setze das aktuelle Profil für den Copy-Button
        copyButton.dataset.profileName = `[${matchedProfiles[0].id}] - ${matchedProfiles[0].colors.join(", ")}`;
        console.log("Button aktiviert für:", copyButton.dataset.profileName);
      } else {
        copyButton.disabled = true;
        copyButton.dataset.profileName = "";
        console.log("Button deaktiviert");
      }
    }
  
    // Event-Listener für den Copy-Button
    copyButton.addEventListener("click", function () {
      const textToCopy = copyButton.dataset.profileName;
      
      if (textToCopy) {
        // In die Zwischenablage kopieren
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            // Erfolgsmeldung anzeigen
            const tooltip = document.createElement("div");
            tooltip.className = "copy-tooltip";
            tooltip.textContent = "Profilname kopiert!";
            document.body.appendChild(tooltip);
            
            // Tooltip nach Animation entfernen
            setTimeout(() => {
              document.body.removeChild(tooltip);
            }, 1500);
          })
          .catch(err => {
            console.error("Fehler beim Kopieren: ", err);
          });
      }
    });
  
    // Verbesserte Funktion zur Aktualisierung des Farbzählers
    function updateColorCounter() {
      const selectedCount = document.querySelectorAll(".color-checkbox:checked").length;
      const totalCount = colorCheckboxes.length;
  
      // Prüfe, ob die Anzahl der ausgewählten Farben mit einem Profil übereinstimmt
      const profileCounts = new Set();
      for (const profile of Object.values(profiles)) {
        profileCounts.add(profile.colors.length);
      }
  
      const counterClass = (selectedCount > 0 && profileCounts.has(selectedCount)) ? "counter-match" : "";
  
      colorCounter.innerHTML = `
        <span class="counter-text">
          <span class="counter-number ${counterClass}">${selectedCount}</span>/<span class="counter-total">${totalCount}</span> Farben ausgewählt
        </span>
      `;
    }
  
    // Reset-Button Funktionalität
    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", function () {
      // Alle Checkboxen abwählen
      colorCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
  
      // Profile neu prüfen, Counter aktualisieren und Copy-Button deaktivieren
      checkProfiles();
      updateColorCounter();
      updateCopyButton([]); // Button explizit deaktivieren
    });
  
    // Funktion zur Überprüfung der Profile
    function checkProfiles() {
      // Ausgewählte Farben sammeln
      const selectedCheckboxes = document.querySelectorAll(".color-checkbox:checked");
      const selectedColors = Array.from(selectedCheckboxes).map((checkbox) => colorMapping[checkbox.value]);
  
      // Wenn keine Farben ausgewählt wurden
      if (selectedColors.length === 0) {
        profileResult.innerHTML = "<p>Bitte wähle mindestens eine Farbe aus.</p>";
        updateColorCounter(); // Counter aktualisieren
        updateCopyButton([]); // Button deaktivieren
        return;
      }
  
      // Finde 100% passende Profile
      const exactMatchProfiles = [];
  
      for (const [profileId, profile] of Object.entries(profiles)) {
        // Prüfen, ob alle ausgewählten Farben im Profil enthalten sind
        const allColorsInProfile = selectedColors.every((color) => profile.colors.includes(color));
        
        // Prüfen, ob alle Profilfarben ausgewählt wurden
        const allProfileColorsSelected = profile.colors.every((color) => selectedColors.includes(color));
        
        // Nur wenn beides zutrifft, handelt es sich um eine 100% Übereinstimmung
        if (allColorsInProfile && allProfileColorsSelected) {
          exactMatchProfiles.push({
            id: profileId,
            name: profile.name,
            colors: profile.colors,
          });
        }
      }
  
      // Ergebnisse anzeigen
      let resultHTML = "";
  
      if (exactMatchProfiles.length === 0) {
        resultHTML = `
          <div class="no-match">
            <p>Kein 100% passendes Profil für die ausgewählten Farben gefunden.</p>
            <p>Ausgewählte Farben: 
              <div class="color-list">
                ${selectedColors.map((color) => `<span class="color-pill">${color}</span>`).join(" ")}
              </div>
            </p>
          </div>
        `;
        updateCopyButton([]); // Button deaktivieren
      } else {
        exactMatchProfiles.forEach((profile) => {
          resultHTML += `
            <div class="profile-match">
              <h3>${profile.id}: ${profile.name}</h3>
              <p>Perfekte Übereinstimmung mit: 
                <div class="color-list">
                  ${profile.colors.map((color) => `<span class="color-pill">${color}</span>`).join(" ")}
                </div>
              </p>
            </div>
          `;
        });
        updateCopyButton(exactMatchProfiles); // Button aktivieren mit passendem Profil
      }
  
      profileResult.innerHTML = resultHTML;
  
      // Aktualisiere den Farbzähler
      updateColorCounter();
    }
  
    // Jede Checkbox mit einem Event-Listener versehen
    colorCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", checkProfiles);
    });
  
    // Initial ausführen
    checkProfiles();
    updateColorCounter();
  });
  