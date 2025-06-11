# MFM CSV Converter - Web App

Eine benutzerfreundliche Web-Anwendung zur Konvertierung von MoneyMoney CSV-Exporten in ein Format, das mit der Finesse-Buchhaltungssoftware für den Motorflugverein Münster (MFM) kompatibel ist.

## Übersicht

Diese Web-Anwendung verarbeitet CSV-Dateien, die aus MoneyMoney (deutsche Banking-Software) exportiert wurden, und konvertiert sie direkt im Browser in ein spezifisches Format, das von der Finesse-Buchhaltungssoftware benötigt wird. Die Konvertierung erfolgt vollständig client-seitig - keine Daten verlassen Ihren Computer.

## Funktionen

- ✅ **Drag & Drop Interface**: Einfach CSV-Dateien in den Browser ziehen
- ✅ **Client-seitige Verarbeitung**: Alle Daten bleiben lokal auf Ihrem Computer
- ✅ **Automatische Extraktion der Mitgliedsnummer**: Analysiert Mitgliedsnummern aus Zahlungsbeschreibungen (Format: `XXXXX MFM`)
- ✅ **Echtzeit-Validierung**: Sofortige Überprüfung und Fehlermeldungen
- ✅ **Sofortiger Download**: Ein-Klick-Download der konvertierten Datei
- ✅ **Mobile-freundlich**: Funktioniert auf Desktop, Tablet und Smartphone
- ✅ **Keine Installation erforderlich**: Läuft direkt im Browser

## Eingabeformat

Die Web-App akzeptiert CSV-Dateien aus MoneyMoney mit den folgenden Spalten:
- `Name` - Mitgliedsname (Format: "Nachname, Vorname")
- `Verwendungszweck` - Zahlungsbeschreibung (muss Mitgliedsnummer + "MFM" enthalten)
- `Betrag` - Betrag (deutsches Format mit Komma als Dezimaltrennzeichen)
- Weitere Bankdetails (Konto, Bank, etc.)

### Beispiel-Eingabezeile
```
MUSTERMANN, MAX;12345 MFM Flugvorauszahlung monatlich 80,00 Mitgliedsbeitrag monatlich 50,00;DE12345678901234567890;BANKDEFFXXX;130,00;EUR;...
```

## Ausgabeformat

Die Anwendung generiert eine CSV-Datei (`import-ameavia.csv`) mit 15 Spalten, optimiert für den Finesse-Import:

| Spalte | Beschreibung | Quelle |
|--------|--------------|---------|
| Mitgliedsnummer | Mitgliedsnummer | Extrahiert aus Verwendungszweck |
| Nachname, Vorname | Vollständiger Name | Aus Name-Feld |
| Suchwort | Suchbegriff | Gleich wie Name |
| Straße | Straßenadresse | Statisch: "" |
| PLZ | Postleitzahl | Statisch: |
| Ort | Stadt | Statisch: "" |
| Landeskennzahl | Ländercode | Statisch: "D" |
| Datum der Buchung | Buchungsdatum | Aktuelles Datum |
| Gegenkonto Bank | Gegenkonto | Statisch: "1100" |
| Mitgliedsnummer | Mitgliedsnummer (Duplikat) | Gleich wie Spalte 1 |
| Betrag | Betrag | Konvertiert zu Dezimalformat |
| Fortlaufende Nummer | Fortlaufende Nummer | Zeilennummer |
| Buchungstext | Buchungstext | Statisch: "Mitgliedsbeitrag / Flugvorauszahlung" |
| Nachname | Nachname | Extrahiert aus Name |
| Vorname | Vorname | Extrahiert aus Name |

## 🌐 Online verwenden

**Live-Version:** [Ihre Vercel URL hier]

Die Web-App ist direkt im Browser verwendbar - keine Installation erforderlich!

## 💻 Lokal ausführen

### Voraussetzungen
- Einen modernen Webbrowser
- Python oder Node.js (für lokalen Server)

### Option 1: Python Server
```bash
# Python 3
python3 -m http.server 8000

# Dann öffnen Sie: http://localhost:8000
```

### Option 2: Node.js Server
```bash
npx http-server -p 8000 -o
```

### Option 3: VS Code Live Server
1. VS Code öffnen
2. "Live Server" Extension installieren
3. Rechtsklick auf `index.html` → "Open with Live Server"

## 📖 Verwendung

### 1. Web-App öffnen
Besuchen Sie die URL (online oder lokal)

### 2. CSV-Datei hochladen
- **Drag & Drop**: Ziehen Sie Ihre MoneyMoney CSV-Datei in den Upload-Bereich
- **Oder klicken**: Klicken Sie auf den Upload-Bereich und wählen Sie die Datei aus

### 3. Konvertieren
- Klicken Sie auf den "Konvertieren" Button
- Die Verarbeitung erfolgt sofort im Browser

### 4. Herunterladen
- Klicken Sie auf "Download Ergebnis"
- Die Datei `import-ameavia.csv` wird heruntergeladen

**Wichtig**: Ihre Daten verlassen niemals Ihren Computer - die gesamte Verarbeitung erfolgt lokal im Browser!

## 🚨 Fehlerbehandlung

Die Web-App bietet benutzerfreundliche Fehlermeldungen:

### Fehlende Mitgliedsnummer
Wenn eine Mitgliedsnummer nicht aus dem `Verwendungszweck`-Feld extrahiert werden kann:
```
❌ Fehler: Mitgliedsnummer konnte nicht aus Verwendungszweck extrahiert werden in Zeile 5.
Name: "Mustermann, Max"
Verwendungszweck: "Monatliche Zahlung ohne Mitglieds-ID"
```

### Ungültige Datei
```
❌ Bitte wählen Sie eine CSV-Datei aus.
```

### Leere Datei
```
❌ Fehler: CSV-Datei ist leer
```

## 📁 Dateistruktur

```
MFM-CSV-export/
├── index.html              # Web-Anwendung
├── vercel.json             # Vercel-Konfiguration
├── README.md               # Diese Dokumentation
└── moneymoney.csv          # Beispiel-Eingabedatei (optional)
```

## 🚀 Vercel-Deployment

### Automatisches Deployment
1. Repository zu GitHub pushen
2. GitHub-Account mit Vercel verbinden
3. Repository importieren
4. Automatisches Deployment

### Manuelles Deployment
```bash
# Vercel CLI installieren
npm i -g vercel

# Deployment
vercel

# Produktions-Deployment
vercel --prod
```

## Mitgliedsnummer-Format

Das Skript erwartet Mitgliedsnummern in der Zahlungsbeschreibung (`Verwendungszweck`) im folgenden Format:

- Muster: `[Nummer] MFM` (nicht case-sensitiv)
- Beispiele:
  - ✅ `12345 MFM Flugvorauszahlung monatlich 80,00`
  - ✅ `67890 MFM Beitrag monatlich 10,00`
  - ✅ `11111 mfm Monatliche Zahlung`
  - ❌ `MFM 12345 Monatliche Zahlung` (Nummer muss zuerst kommen)
  - ❌ `Zahlung für Mitglied 12345` (MFM fehlt)

## 🛠️ Fehlerbehebung

### Häufige Probleme

1. **Datei wird nicht akzeptiert**
   - Stellen Sie sicher, dass es eine `.csv` Datei ist
   - Überprüfen Sie, ob die Datei nicht beschädigt ist

2. **Browser-Kompatibilität**
   - Verwenden Sie einen modernen Browser (Chrome, Firefox, Safari, Edge)
   - JavaScript muss aktiviert sein

3. **Fehler bei Mitgliedsnummer-Extraktion**
   - Überprüfen Sie das `Verwendungszweck`-Format
   - Stellen Sie sicher, dass Mitgliedsnummern dem erwarteten Muster folgen: `[Nummer] MFM`

4. **Lokaler Server startet nicht**
   - Überprüfen Sie, ob Port 8000 bereits belegt ist
   - Verwenden Sie einen anderen Port: `python3 -m http.server 8001`

### Hilfe erhalten

Wenn Sie auf Probleme stoßen:
1. Überprüfen Sie die Browser-Konsole (F12) für detaillierte Fehlermeldungen
2. Überprüfen Sie, ob Ihr CSV-Format dem erwarteten MoneyMoney-Export entspricht
3. Testen Sie mit einer kleineren CSV-Datei

## 🔧 Technische Details

- **Client-seitig**: Läuft vollständig im Browser
- **Keine Server-Verarbeitung**: Daten verlassen niemals Ihren Computer
- **CSV-Trennzeichen**: Semikolon (`;`)
- **Zeichenkodierung**: UTF-8 Eingabe → UTF-8 mit BOM Ausgabe
- **Browser-Unterstützung**: Alle modernen Browser
- **Dateigröße**: Praktisch unbegrenzt (abhängig vom Browser-Speicher)

## Lizenz

Dieses Projekt ist für den internen Gebrauch des Motorflugvereins Münster (MFM) bestimmt. 