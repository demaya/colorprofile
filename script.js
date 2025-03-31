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
  
    // Profile mit nur den Farben
    const profiles = {
      A: ["grau", "pink", "orange", "blau", "soft", "schwarz", "weinrot", "braun", "weiß"],
      B: ["weiß", "pink", "orange", "grau", "blau", "soft"],
      C: ["pink", "weiß", "grau", "soft"],
      D: ["grau", "pink", "orange", "blau"],
      E: ["orange", "weiß", "blau", "grau", "soft", "schwarz", "weinrot", "braun"],
      F: ["weiß", "schwarz", "pink", "weinrot", "grau", "braun", "blau", "soft"],
      G: ["pink", "orange", "weiß", "grau", "soft"],
      H: ["weiß", "orange", "weinrot", "schwarz", "braun", "blau"],
      I: ["orange", "weinrot", "schwarz", "braun", "blau"],
      J: ["pink", "orange", "blau", "grau", "schwarz", "weinrot", "braun"],
      K: ["braun", "weinrot", "schwarz", "grau", "weiß", "soft"],
      L: ["soft", "weiß", "pink"],
      M: ["soft", "weiß", "pink", "grau", "blau"],
      N: ["soft", "weiß", "braun", "schwarz"],
      O: ["weiß", "orange", "blau", "schwarz", "weinrot"],
      P: ["grau", "pink", "soft", "weiß", "schwarz", "braun", "weinrot"],
      Q: ["soft", "weiß", "pink", "braun", "schwarz", "weinrot"],
      R: ["grau", "orange", "pink", "blau", "soft", "weiß", "weinrot"],
      S: ["weiß", "orange", "blau", "soft", "schwarz", "weinrot", "braun"],
      T: ["grau", "weiß", "pink", "soft", "braun", "schwarz", "orange"],
      U: ["weiß", "grau", "soft", "blau"],
      V: ["weiß", "grau", "pink", "blau", "soft", "schwarz", "braun"],
      W: ["weiß", "soft", "grau", "pink", "braun", "schwarz"]
    };
    
  
    // Funktion zum Generieren des Profilnamens
    function getProfileName(profileId, colors) {
      return `[${profileId}] - ${colors.join(", ")}`;
    }
  
    // Funktion zum Aktualisieren des Copy-Buttons
    function updateCopyButton(matchedProfiles) {
      if (matchedProfiles && matchedProfiles.length > 0) {
        copyButton.disabled = false;
        
        // Setze das aktuelle Profil für den Copy-Button
        copyButton.dataset.profileName = getProfileName(matchedProfiles[0].id, matchedProfiles[0].colors);
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
        profileCounts.add(profile.length);
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

        // Dropdown zurücksetzen
        profileSelect.value = "";
  
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
  
      for (const [profileId, profileColors] of Object.entries(profiles)) {
        // Prüfen, ob alle ausgewählten Farben im Profil enthalten sind
        const allColorsInProfile = selectedColors.every((color) => profileColors.includes(color));
        
        // Prüfen, ob alle Profilfarben ausgewählt wurden
        const allProfileColorsSelected = profileColors.every((color) => selectedColors.includes(color));
        
        // Nur wenn beides zutrifft, handelt es sich um eine 100% Übereinstimmung
        if (allColorsInProfile && allProfileColorsSelected) {
          exactMatchProfiles.push({
            id: profileId,
            name: getProfileName(profileId, profileColors),
            colors: profileColors,
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
  
    // Dropdown-Menü mit Profilen füllen
    const profileSelect = document.getElementById("profileSelect");
    
    // Profile alphabetisch sortieren und ins Dropdown einfügen
    Object.entries(profiles)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([profileId, profileColors]) => {
            const option = document.createElement("option");
            option.value = profileId;
            option.textContent = getProfileName(profileId, profileColors);
            profileSelect.appendChild(option);
        });

    // Event-Listener für Profilauswahl
    profileSelect.addEventListener("change", function() {
        // Alle Checkboxen zurücksetzen
        colorCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        const selectedProfileId = this.value;
        if (selectedProfileId) {
            const selectedProfileColors = profiles[selectedProfileId];
            
            // Checkboxen entsprechend dem gewählten Profil setzen
            colorCheckboxes.forEach(checkbox => {
                const colorName = colorMapping[checkbox.value];
                if (selectedProfileColors.includes(colorName)) {
                    checkbox.checked = true;
                }
            });
        }

        // Profile neu prüfen und Counter aktualisieren
        checkProfiles();
        updateColorCounter();
    });
  
    // Jede Checkbox mit einem Event-Listener versehen
    colorCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", checkProfiles);
    });
  
    // Funktion für die Kategorie-Buttons
    function setupCategoryButtons() {
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                const container = category === 'light' ? 
                    document.querySelector('.light-colors') : 
                    document.querySelector('.dark-colors');
                
                const checkboxes = container.querySelectorAll('.color-checkbox');
                const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                
                // Toggle Zustand
                checkboxes.forEach(checkbox => {
                    checkbox.checked = !allChecked;
                });
                
                // Button Text und Stil aktualisieren
                this.textContent = allChecked ? 'Alle auswählen' : 'Alle abwählen';
                this.classList.toggle('active', !allChecked);
                
                checkProfiles();
                updateColorCounter();
            });
        });
    }

    // Initialisiere die Kategorie-Buttons
    setupCategoryButtons();
  
    // Initial ausführen
    checkProfiles();
    updateColorCounter();
  });
  