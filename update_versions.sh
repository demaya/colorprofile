#!/bin/bash

# Aktuellen Zeitstempel generieren
TIMESTAMP=$(date +%s)

# Prüfen, ob index.html existiert
if [ ! -f "index.html" ]; then
    echo "Fehler: index.html nicht gefunden!"
    exit 1
fi

# Dateiinhalt auslesen
HTML_CONTENT=$(cat index.html)

# Ersetzen der CSS-Versionierung mit awk
HTML_CONTENT=$(echo "$HTML_CONTENT" | awk '{gsub(/styles\.css\?v=[0-9\.]*|styles\.css/, "styles.css?v='$TIMESTAMP'"); print}')

# Ersetzen der JavaScript-Versionierung mit awk
HTML_CONTENT=$(echo "$HTML_CONTENT" | awk '{gsub(/script\.js\?v=[0-9\.]*|script\.js/, "script.js?v='$TIMESTAMP'"); print}')

# Überprüfen, ob Ersetzungen erfolgreich waren
if echo "$HTML_CONTENT" | grep -q "styles.css?v=$TIMESTAMP"; then
    echo "CSS-Version aktualisiert auf v=$TIMESTAMP"
    CSS_UPDATED=true
else
    echo "Warnung: CSS-Verlinkung konnte nicht aktualisiert werden!"
    CSS_UPDATED=false
fi

if echo "$HTML_CONTENT" | grep -q "script.js?v=$TIMESTAMP"; then
    echo "JavaScript-Version aktualisiert auf v=$TIMESTAMP"
    JS_UPDATED=true
else
    echo "Warnung: JavaScript-Verlinkung konnte nicht aktualisiert werden!"
    JS_UPDATED=false
fi

# Aktualisierte Datei speichern, wenn mindestens eine Aktualisierung erfolgt ist
if [ "$CSS_UPDATED" = true ] || [ "$JS_UPDATED" = true ]; then
    echo "$HTML_CONTENT" > index.html
    echo "Versionierung erfolgreich!"
else
    echo "Keine Änderungen vorgenommen."
fi

# Debug-Ausgabe
echo "Aktualisierte HTML-Datei:"
grep -E '<link|<script' index.html
