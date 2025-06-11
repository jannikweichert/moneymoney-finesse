# MFM CSV Export Tool

Ein TypeScript-Dienstprogramm zur Konvertierung von MoneyMoney CSV-Exporten in ein Format, das mit der Finesse-Buchhaltungssoftware für den Motorflugverein Münster (MFM) kompatibel ist.

## Übersicht

Dieses Tool verarbeitet CSV-Dateien, die aus MoneyMoney (deutsche Banking-Software) exportiert wurden, und konvertiert sie in ein spezifisches Format, das von der Finesse-Buchhaltungssoftware benötigt wird. Es extrahiert Mitgliedsnummern aus Zahlungsbeschreibungen und formatiert die Daten für den Import in das Buchhaltungssystem des Vereins.

## Funktionen

- ✅ **Automatische Extraktion der Mitgliedsnummer**: Analysiert Mitgliedsnummern aus Zahlungsbeschreibungen (Format: `XXXXX MFM`)
- ✅ **Datenvalidierung**: Stellt sicher, dass alle erforderlichen Felder vorhanden sind und validiert die Extraktion der Mitgliedsnummer
- ✅ **Zeichenkodierung-Konvertierung**: Konvertiert von UTF-8 zu Latin-1 für Kompatibilität mit älteren Systemen
- ✅ **Fehlerbehandlung**: Bietet detaillierte Fehlermeldungen mit Zeilennummern zur Fehlerbehebung
- ✅ **Datenintegritätsprüfungen**: Überprüft, ob Eingabe- und Ausgabezeilenzahlen übereinstimmen

## Eingabeformat

Das Skript erwartet eine CSV-Datei namens `moneymoney.csv` mit den folgenden Spalten:
- `Name` - Mitgliedsname (Format: "Nachname, Vorname")
- `Verwendungszweck` - Zahlungsbeschreibung (muss Mitgliedsnummer + "MFM" enthalten)
- `Betrag` - Betrag (deutsches Format mit Komma als Dezimaltrennzeichen)
- Weitere Bankdetails (Konto, Bank, etc.)

### Beispiel-Eingabezeile
```
MUSTERMANN, MAX;12345 MFM Flugvorauszahlung monatlich 80,00 Mitgliedsbeitrag monatlich 50,00;DE12345678901234567890;BANKDEFFXXX;130,00;EUR;...
```

## Ausgabeformat

Das Skript generiert `import-ameavia.csv` mit 15 Spalten, optimiert für den Finesse-Import:

| Spalte | Beschreibung | Quelle |
|--------|--------------|---------|
| Mitgliedsnummer | Mitgliedsnummer | Extrahiert aus Verwendungszweck |
| Nachname, Vorname | Vollständiger Name | Aus Name-Feld |
| Suchwort | Suchbegriff | Gleich wie Name |
| Straße | Straßenadresse | Statisch: "" |
| PLZ | Postleitzahl | Statisch: "" |
| Ort | Stadt | Statisch: "Münster" |
| Landeskennzahl | Ländercode | Statisch: "D" |
| Datum der Buchung | Buchungsdatum | Aktuelles Datum |
| Gegenkonto Bank | Gegenkonto | Statisch: "1100" |
| Mitgliedsnummer | Mitgliedsnummer (Duplikat) | Gleich wie Spalte 1 |
| Betrag | Betrag | Konvertiert zu Dezimalformat |
| Fortlaufende Nummer | Fortlaufende Nummer | Zeilennummer |
| Buchungstext | Buchungstext | Statisch: "Mitgliedsbeitrag / Flugvorauszahlung" |
| Nachname | Nachname | Extrahiert aus Name |
| Vorname | Vorname | Extrahiert aus Name |

## Voraussetzungen

- Node.js (Version 14 oder höher)
- npm (Node Package Manager)

## Installation

1. Repository klonen oder herunterladen
2. Abhängigkeiten installieren:

```bash
npm install
```

Das Skript benötigt folgende Abhängigkeiten:
- `iconv-lite` - Für Zeichenkodierung-Konvertierung
- `typescript` - TypeScript-Compiler
- `ts-node` - TypeScript-Ausführungsumgebung
- `@types/iconv-lite` - TypeScript-Definitionen

## Verwendung

### 1. Daten vorbereiten

Platzieren Sie Ihren MoneyMoney CSV-Export im Projektverzeichnis und benennen Sie ihn `moneymoney.csv`.

**Wichtig**: Stellen Sie sicher, dass Ihre CSV-Datei UTF-8-kodiert ist und Semikolons (`;`) als Trennzeichen verwendet.

### 2. Konvertierung ausführen

Führen Sie das Skript mit ts-node aus:

```bash
npx ts-node convert-to-finesse.ts
```

### 3. Ausgabe überprüfen

Das Skript wird:
- Jede Zeile aus der Eingabedatei verarbeiten
- Mitgliedsnummern aus Zahlungsbeschreibungen extrahieren
- `import-ameavia.csv` in Latin-1-Kodierung generieren
- Verarbeitungsstatistiken anzeigen

**Erfolgreiche Ausgabe:**
```
✅ Verarbeitung erfolgreich: 182 Zeilen verarbeitet
✅ Konvertierung abgeschlossen: /pfad/zu/import-ameavia.csv
```

## Fehlerbehandlung

Das Skript enthält umfassende Fehlerprüfungen:

### Fehlende Mitgliedsnummer
Wenn eine Mitgliedsnummer nicht aus dem `Verwendungszweck`-Feld extrahiert werden kann:
```
❌ Fehler in Zeile 5: Mitgliedsnummer konnte nicht aus Verwendungszweck extrahiert werden.
Name: "Mustermann, Max"
Verwendungszweck: "Monatliche Zahlung ohne Mitglieds-ID"
```

### Ungleiche Zeilenzahl
Wenn Eingabe- und Ausgabezeilenzahlen nicht übereinstimmen:
```
❌ Fehler: Anzahl der Eingabezeilen (182) stimmt nicht mit der Anzahl der Ausgabezeilen (181) überein!
```

## Dateistruktur

```
MFM-CSV-export/
├── convert-to-finesse.ts    # Hauptkonvertierungsskript
├── package.json             # Projektabhängigkeiten
├── tsconfig.json           # TypeScript-Konfiguration
├── moneymoney.csv          # Eingabedatei (platzieren Sie Ihre Daten hier)
├── import-ameavia.csv      # Ausgabedatei (generiert)
└── README.md               # Diese Dokumentation
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

## Fehlerbehebung

### Häufige Probleme

1. **Datei nicht gefunden**
   - Stellen Sie sicher, dass `moneymoney.csv` im Projektverzeichnis existiert
   - Überprüfen Sie Dateiberechtigungen

2. **Kodierungsprobleme**
   - Überprüfen Sie, ob die Eingabedatei UTF-8-kodiert ist
   - Prüfen Sie auf Sonderzeichen in Namen oder Beschreibungen

3. **Fehler bei Mitgliedsnummer-Extraktion**
   - Überprüfen Sie das `Verwendungszweck`-Format
   - Stellen Sie sicher, dass Mitgliedsnummern dem erwarteten Muster folgen

4. **TypeScript-Kompilierungsfehler**
   - Führen Sie `npm install` aus, um sicherzustellen, dass alle Abhängigkeiten installiert sind
   - Überprüfen Sie die Node.js-Versionskompatibilität

### Hilfe erhalten

Wenn Sie auf Probleme stoßen:
1. Überprüfen Sie die Fehlermeldungen auf spezifische Zeilennummern und Details
2. Überprüfen Sie, ob Ihr Eingabedatenformat der erwarteten Struktur entspricht
3. Stellen Sie sicher, dass alle Abhängigkeiten ordnungsgemäß installiert sind

## Technische Details

- **Sprache**: TypeScript
- **Zeichenkodierung**: Eingabe (UTF-8) → Ausgabe (Latin-1)
- **CSV-Trennzeichen**: Semikolon (`;`)
- **Zeilenendezeichen**: Windows-Format (`\r\n`)
- **Dezimalformat**: Deutsches Format (Komma als Dezimaltrennzeichen)

## Lizenz

Dieses Projekt ist für den internen Gebrauch des Motorflugvereins Münster (MFM) bestimmt. 