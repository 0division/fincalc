# Proposal: Nachvollziehbare Ergebnisse & Qualitätssicherung

Status: Vorschlag, nicht implementiert.

## 1. Cluster

Dieses Proposal bündelt nachvollziehbare Kennzahlen, reproduzierbare Rechenstände und echte Browser-Tests. Es ergänzt die [Dokumenthistorie](./002-document-history-and-editing.md), ersetzt sie aber nicht: Ein alter Eingabestand erklärt noch nicht, wie eine Zahl berechnet wurde.

Die Nummer 000 kennzeichnet einen begleitenden Querschnitt, keinen vorgeschalteten Implementierungsblock: Browser-Tests ab der GUI, Rechentests und Erklärungen mit jedem folgenden Modellschritt umsetzen.

## 2. Eine Zahl muss erklärbar sein

Bei Kennzahlen eine Detailansicht „Wie berechnet?“ anbieten:

- Bedeutung, Zeitraum, Währung und nominale/reale Darstellung.
- Anfangsbestand, Kapitalbewegungen, Erträge, Wertänderungen, Kosten und Endbestand.
- Quelle jeder Position: Regel, Asset-Komponente, Ereignis oder bestätigte Eingabe.
- Gesonderte Darstellung für Verbindlichkeiten und interne Umbuchungen.
- Relevante Annahmen, nicht unterstützte Fälle und Rundungen.
- Bei Steuern Quellen-/Regelversion und Berechnungsgrundlage.

Erklärungswerte aus demselben Rechenlauf ableiten, nicht parallel eine zweite „Erklärungsformel“ implementieren. Summen müssen mit der angezeigten Kennzahl abstimmen.

Alle relevanten IDs und Zeiträume mitführen, damit eine Zeile zur Ursprungsregel navigiert. Noch vorhandene Altberechnungen sichtbar als solche kennzeichnen; eine schöne Detailansicht macht eine Pauschalschätzung nicht genauer.

## 3. Reproduzierbare Berechnung

Ein Rechenlauf erhält explizit:

- Dokument-ID und Revision.
- Bewertungsdatum, Horizont und Rechenkonvention.
- Version des Simulationskerns und gegebenenfalls Steuerregel-Version.
- Einheiten und Rundungsregeln.

Rechenfunktionen lesen nicht implizit das aktuelle Datum oder DOM-Felder. Importierte Ergebnisse sind keine verbindliche Wahrheit; aus den Eingaben neu berechnen. Abweichungen zwischen gespeichertem Bericht und neuem Ergebnis mit Versions-/Annahmenunterschieden erklären.

## 4. Tests auf drei Ebenen

### Fachliche Tests

Reine Rechenfunktionen mit festen Daten, Grenzen und abgestimmten Bestands-/Cashflow-Brücken testen. Insbesondere Kapitalbewegungen nicht als Gewinn zählen und interne Transfers eliminieren.

### DOM-Komponententests

Bestehende Tests weiterverwenden: Eingaben, Validierung, Sprache, Dialogaktionen und YAML-Roundtrips schnell testen.

### Echte Browser-Tests

Eine kleine ergänzende Suite, z. B. mit Playwright, für Dinge, die JSDOM nicht realistisch prüft:

- Native Dialoge: Fokus, Escape, Rückkehr zum Auslöser.
- Downloads: Dateiname und tatsächlichen Inhalt prüfen.
- Dateiimport und sichtbare Fehlerrückmeldung.
- Responsive Toolbar, Tabellen-Overflow und Bedienbarkeit per Tastatur.
- Clipboard-Zugriff unter unterstützten Bedingungen sowie Ablehnung.
- Lokale Wiederherstellung nach Reload und ungespeicherte Entwürfe.

Eigenen kurzlebigen Testserver mit freiem Port verwenden und nach dem Test beenden. Kein dauerhaft laufender Agent-Hintergrundprozess. Browserdaten und Beispielpläne sind synthetisch; keine echten Finanzdateien als Testfixtures.

Browser-Tests als eigener Befehl, beispielsweise `npm run test:browser`; die schnelle Suite bleibt `npm test`. Abhängigkeiten und CI erst bei Implementierung ergänzen.

## 5. YAML-Auswirkungen

**Für Tests und die Erklärungsoberfläche ist keine neue finanzielle YAML-Struktur nötig.** Historisierte Eingaben müssen lediglich stabil referenzierbar sein; dies deckt das Dokument-Proposal ab.

Optional kann ein expliziter Rechenkontext im nächsten Zielschema gespeichert werden:

```yaml
schemaVersion: 2
document:
  id: plan-main
  revisionId: revision-12
  name: Finanzplanung
planning:
  valuationDate: "2026-12-31"
  horizonYears: 20
  inflationRatePercent: 2
```

Dieser Ausschnitt ist noch nicht unterstützt. Das bisher versteckte aktuelle Datum wird eine bestätigte Planungsannahme. Beim Migrieren nicht rückwirkend behaupten, ein unbekannter alter Bewertungsstichtag sei bekannt.

Ein optionaler **separater Berichtsexport** könnte so aussehen:

```yaml
reportFormat: fincalc-calculation
reportVersion: 1
source:
  documentId: plan-main
  revisionId: revision-12
calculation:
  valuationDate: "2026-12-31"
  engineVersion: example-engine-version
  currency: EUR
  valueBasis: nominal
results:
  - metric: asset-closing-value
    assetId: savings
    periodEnd: "2027-12-31"
    openingValue: 10000
    netCapitalMovements: 1200
    valueChange: 0
    retainedIncome: 0
    internalCostsAndTaxes: 0
    creditedSupport: 0
    closingValue: 11200
```

Auch der Bericht ist ein noch nicht unterstütztes Strukturbeispiel. Die Engine-Version ist ein Platzhalter. Werte sind illustrative Abstimmungswerte, keine Prognose. Berichte enthalten Ergebnisse und Herkunft, werden aber nicht als Finanzplan oder als neue Buchungen importiert. Die Originaleingaben müssen für eine vollständige Wiederberechnung verfügbar bleiben.

## 6. Umsetzung und Akzeptanz

Browser-Testgrundlage bereits bei der [GUI-Umsetzung](./001-gui-layout-and-interactions.md) ergänzen. Fachliche Erklärungen mit dem gemeinsamen Simulationskern ausbauen, nicht erst nach allen Features testen.

- Identische Eingaben, Datum und Regel-/Engine-Version ergeben dieselben Resultate.
- Jede Ergebniszeile ist auf ihre Quelle rückführbar.
- Summen stimmen mit Kennzahl, Bestandsbrücke und Journal überein.
- Berichtsimporte erzeugen keine doppelten Zahlungsströme.
- UI funktioniert in schmaler und breiter Ansicht ohne unzugängliche Controls.
- Testserver und Browserkontexte werden auch bei Fehlern aufgeräumt.
- Dokumenthistorie und Berichte bleiben beim normalen Teilen optional, um zusätzliche sensible Daten nicht unbeabsichtigt weiterzugeben.
