import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import iconv from 'iconv-lite';

const inputFilePath = path.resolve(__dirname, 'moneymoney.csv');
const outputFilePath = path.resolve(__dirname, 'import-ameavia.csv');

const TARGET_COLUMNS = [
  'Mitgliedsnummer',
  'Nachname, Vorname',
  'Suchwort',
  'Straße',
  'PLZ',
  'Ort',
  'Landeskennzahl',
  'Datum der Buchung',
  'Gegenkonto Bank',
  'Mitgliedsnummer',
  'Betrag',
  'Fortlaufende Nummer',
  'Buchungstext',
  'Nachname',
  'Vorname',
];

function parseCsvLine(line: string): string[] {
  return line.split(';');
}

function extractMitgliedsnummer(verwendungszweck: string): string {
  const match = verwendungszweck.match(/(\d+)\s*MFM/i);
  return match ? match[1] : '';
}

async function convertUtf8ToLatin1Csv() {
  const inputStream = fs.createReadStream(inputFilePath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: inputStream });

  const outputLines: string[] = [];
  let headerMap: Record<string, number> = {};
  let isFirstLine = true;
  let inputRowCount = 0;

  for await (const line of rl) {
    const columns = parseCsvLine(line);

    // Parse header line first
    if (isFirstLine) {
      columns.forEach((header, index) => {
        headerMap[header.trim()] = index;
      });
      isFirstLine = false;
      continue; // Skip header line in output
    }

    // Count input rows (excluding header)
    inputRowCount++;

    // Helper function to get column value by name
    const getColumn = (columnName: string): string => {
      const index = headerMap[columnName];
      return index !== undefined ? (columns[index] || '') : '';
    };

    const ordered = TARGET_COLUMNS.map((col, index) => {
      switch (col) {
        case 'Mitgliedsnummer':
          const mitgliedsnummer = extractMitgliedsnummer(getColumn('Verwendungszweck'));
          if (!mitgliedsnummer) {
            throw new Error(`❌ Fehler in Zeile ${outputLines.length + 2}: Mitgliedsnummer konnte nicht aus Verwendungszweck extrahiert werden.\nName: "${getColumn('Name')}"\nVerwendungszweck: "${getColumn('Verwendungszweck')}"`);
          }
          return mitgliedsnummer;
        case 'Nachname, Vorname':
          return getColumn('Name');
        case 'Suchwort':
          return getColumn('Name');
        case 'Straße':
          return ''; // Empty string
        case 'PLZ':
          return ''; // Empty string
        case 'Ort':
          return ''; // Static value as per example
        case 'Landeskennzahl':
          return 'D'; // Static value
        case 'Datum der Buchung':
          return new Date().toLocaleDateString('de-DE'); // Current date
        case 'Gegenkonto Bank':
          return '1100'; // Static value
        case 'Betrag':
          return getColumn('Betrag').replace(',', '.'); // Convert to decimal
        case 'Fortlaufende Nummer':
          return (inputRowCount).toString(); // Current row number
        case 'Buchungstext':
          return 'Mitgliedsbeitrag / Flugvorauszahlung'; // Static text
        case 'Nachname':
          return getColumn('Name').split(', ')[0] || '';
        case 'Vorname':
          return getColumn('Name').split(', ')[1] || '';
        default:
          return getColumn(col);
      }
    });

    function extractMitgliedsbeitrag(verwendungszweck: string): string {
      const match = verwendungszweck.match(/Mitgliedsbeitrag monatlich (\d+,\d+)/i);
      return match ? match[1] : '';
    }

    function extractFlugvorauszahlung(verwendungszweck: string): string {
      const match = verwendungszweck.match(/Flugvorauszahlung monatlich (\d+,\d+)/i);
      return match ? match[1] : '';
    }

    outputLines.push(ordered.join(';'));
  }

  // Double check: ensure input row count matches output row count
  if (inputRowCount !== outputLines.length) {
    throw new Error(`❌ Fehler: Anzahl der Eingabezeilen (${inputRowCount}) stimmt nicht mit der Anzahl der Ausgabezeilen (${outputLines.length}) überein!`);
  }

  console.log(`✅ Verarbeitung erfolgreich: ${inputRowCount} Zeilen verarbeitet`);

  const outputBuffer = iconv.encode(outputLines.join('\r\n'), 'latin1');
  fs.writeFileSync(outputFilePath, outputBuffer);
  console.log(`✅ Konvertierung abgeschlossen: ${outputFilePath}`);
}

convertUtf8ToLatin1Csv().catch((err) => console.error('❌ Fehler:', err));
