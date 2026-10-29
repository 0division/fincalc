# Proposal: Übersichtliche Oberfläche und konsistente Bedienung

Status: Designvorschlag, keine Änderung an Anwendung oder YAML-Format.

Priorität: GUI zuerst umsetzen. Die spätere fachliche Ablösung von „Ruhestand & Vermögen“ bleibt von den nachfolgenden Datenmodell-Proposals abhängig.

## 1. Empfohlener Seitenaufbau

```text
fincalc.de                         Domain | Sprache | Dateiaktionen

Zusammenfassung
  Monatlicher Überschuss | Steuerschätzung | Sparpotenzial | Prognose

Persönliche Daten                                         [aufklappen]
Cashflow                                                 [aufklappen]
Planungsannahmen                                          [aufklappen]

Assets                           Ansicht: Karten / Liste   [+ Anlegen]
  Bestehende Assets

Vermögens- & Cashflow-Prognose
  Zeitraum-Schritt | Wertdarstellung | Cashflow-Spalten
  Projektionstabelle
```

Alle Hauptbereiche nutzen die volle Inhaltsbreite, nicht notwendigerweise die gesamte Bildschirmbreite. Eine begrenzte, responsive Seitenbreite erhält Lesbarkeit. Die breite Tabelle scrollt innerhalb ihres Bereichs horizontal, nicht die gesamte Seite.

Die Zusammenfassung ist das erste Element im Hauptbereich. Keine rein visuelle CSS-Umsortierung: DOM-, Lese- und Tastaturreihenfolge entsprechen der Anzeige.

## 2. „Asset anlegen“ als Dialog

**Empfehlung: ja.** Ein klarer primärer Button im Asset-Kopf ersetzt das aufklappbare Anlegeformular. Bestehende Assets bleiben im Hintergrund sichtbar.

- Nativen modalen `<dialog>` verwenden, wie beim YAML-Dialog.
- Titel „Asset anlegen“ / „Add asset“; primäre Aktion „Anlegen“, sekundär „Abbrechen“.
- Felder gruppieren: Identität und Typ, Werte und Beiträge, optionale Steuer-/Fördernotizen.
- Produktspezifische Felder nur bei passendem Typ anzeigen.
- Auf kleinen Bildschirmen nahezu bildschirmfüllend, auf großen Bildschirmen begrenzte Breite und intern scrollbar.
- Anfangsfokus sinnvoll setzen, Fokus im Dialog halten und nach Schließen zum Auslöser zurückführen.
- Escape und Abbrechen schließen; Hintergrundklick verwirft nicht versehentlich Eingaben.
- Bei ungespeicherten Änderungen vor Verwerfen bestätigen. Nach Abbruch ohne Verwerfen bleibt der Entwurf bestehen.
- Bei erfolgreichem Anlegen Dialog schließen, Erfolg melden und das neue Asset auffindbar machen.
- Validierungsfehler am Feld anzeigen; bei Fehlern weder schließen noch Eingaben löschen.

Der Dialog ändert nur den Bedienort, nicht die Asset-Semantik. Später denselben Formularaufbau für Bearbeiten verwenden.

## 3. Laden, Speichern, Teilen und YAML anzeigen

**Empfehlung: Symbole mit verständlicher Beschriftung**, nicht ausschließlich unbeschriftete Icons.

| Aktion | Symbolidee | Beschriftung |
|---|---|---|
| YAML laden | Ordner öffnen | Laden |
| YAML speichern | Download | Speichern |
| YAML kopieren | Zwischenablage/Kopieren | YAML kopieren |
| YAML-Dialog öffnen | Dokument/Code | YAML anzeigen |

„YAML kopieren“ beschreibt das heutige Clipboard-Verhalten genauer als „Teilen“. Kein Share-Symbol verwenden, wenn kein tatsächlicher Freigabedialog geöffnet wird.

- Einfache lokale SVG-Symbole, keine externe Icon-CDN oder große Bibliothek.
- Dekorative SVGs mit `aria-hidden`; echte Buttons mit lokalisierten Namen.
- Desktop: Icon plus kurzer Text. Mobil: kompakte Icons, aber zugängliche Namen und bei Fokus/Zeigerkontakt Hilfetexte; optional ein beschriftetes Dateimenü.
- Mindestens 44 × 44 CSS-Pixel große Zielbereiche als Designziel.
- Erfolg und Fehler in einem sichtbaren Statusbereich mit zugänglicher Ansage melden.
- Kopieren nur nach ausdrücklicher Nutzeraktion; Fehlermeldung bei fehlendem Clipboard-Zugriff.
- YAML bleibt ausschließlich im Dialog sichtbar. Laden ist Dateiauswahl, Speichern ein Download; keine stillschweigende Server-Speicherung.

## 4. Projektionssteuerung nebeneinander

Die heutigen Beschriftungen „Show values“ und „Display values as“ präzisieren:

- **Jahresschritte / Year interval:** Jährlich oder alle 10 Jahre.
- **Wertdarstellung / Value basis:** Nominal, heutige Kaufkraft oder beide.
- **Cashflow-Spalten / Cash flow columns:** Nur Saldo oder Details.

Desktop als zusammenhängende Toolbar oberhalb der Tabelle:

```text
Jahresschritte          Wertdarstellung             Cashflow-Spalten
[Jährlich       v]     [Nominal | Heutige € | Beide] [Nur Saldo | Details]
```

Native Selects sind ebenfalls geeignet, insbesondere bei wenig Platz. Segmentierte Auswahl nur als echte, beschriftete Radiogruppe implementieren, nicht als Sammlung unverbundener Buttons.

- Mobile Darstellung bricht in zwei oder eine Spalte um; keine abgeschnittenen Labels.
- Gleiche Kontrollhöhe, konsistente Abstände und gut sichtbarer Fokus.
- Eine kurze Erklärung zur Kaufkraft an der Steuerung; lange Erläuterungen optional über einen Hilfebereich.
- „Alle 10 Jahre“ betrifft Zeilenabstände, nicht Rechengenauigkeit oder Verzinsung. Anfangs- und Endjahr bleiben enthalten.

## 5. „Cash flow details“ nicht als Disclosure zweckentfremden

Das heutige `<details>` öffnet einen Erklärungstext, steuert aber gleichzeitig zusätzliche Tabellenspalten. Diese versteckte Kopplung ist missverständlich.

**Empfehlung:** explizite Auswahl **„Nur Saldo / Details“** in der Projektions-Toolbar.

- „Nur Saldo“ zeigt die Netto-Cashflow-Spalte.
- „Details“ zeigt zusätzlich Einnahmen, Ausgaben und Anlagen.
- Auswahl ändert nur die Darstellung, nicht die Berechnung.
- Hilfetext getrennt vom Auswahlzustand anbieten.
- Nach Umschalten bleiben Fokus, Tabellenbereich und übrige Einstellungen erhalten.
- Spaltenüberschriften, Gruppen und Summen bleiben bei beiden Wertdarstellungen eindeutig.

## 6. Zusammenfassung nach oben

**Empfehlung: volle Breite direkt unter dem Kopfbereich.**

- Vier Kennzahlen responsiv als vier, zwei oder eine Spalte.
- Pro Kennzahl Einheit und Zeitraum deutlich machen.
- Steuern als Schätzung kennzeichnen; die bestehende Pauschalrechnung nicht durch ein neues Design als verlässlich erscheinen lassen.
- „Portfolio at retirement“ vorerst ehrlicher als „Prognostizierter Portfolio-Endwert“ beschriften, sofern kein tatsächlicher Rentenbeginn modelliert ist.
- Unterschiede zwischen monatlichem Überschuss und jährlichem Sparpotenzial erklären.
- Keine neuen Kennzahlen erfinden, solange ihre Definition nicht mit Cashflows und Assets abgestimmt ist.

## 7. „Ruhestand & Vermögen“: nicht ersatzlos löschen

Der Bereich vermischt globale Annahmen mit separat modelliertem Vermögen. Nur seine Box zu löschen würde Inputs und Berechnungen unsichtbar machen.

### Kurzfristig: sichere Layout-Änderung

- Bestehenden Bereich auf volle Breite setzen und aufklappbar machen.
- Bestehende Felder und Rechnung erhalten.
- Globale Annahmen (Horizont, Inflation) optisch von zusätzlichen Spar-/Pensionsannahmen trennen.
- Überlappungsrisiko mit Assets sichtbar erklären.
- Noch nicht ausschließlich „Planungsannahmen“ nennen, solange dort zusätzliches Vermögen eingegeben wird.

### Zielbild: fachliche Ablösung

- **Planungsannahmen** enthält nur globale Parameter wie Zeitraum und Inflation.
- Aktuelles Sparguthaben wird ein Cash-/Vermögens-Asset mit bestätigtem Anfangsbestand.
- Eine Rendite gehört zu konkreten [Asset-Komponenten](./005-asset-performance-income-and-costs.md), nicht pauschal zu sämtlichen Assets.
- Spar- und Rentenbeiträge werden verknüpfte [Cashflow-Regeln](./004-hierarchical-cashflows-and-assets.md).
- Zusammenfassung und Projektion verwenden denselben Simulationskern.

Diese zweite Stufe ist eine Modelländerung, kein reines GUI-Refactoring. Vor Migration Überlappungen auflösen: vorhandenes Sparguthaben darf nicht erneut als Asset angelegt werden, wenn es bereits dort enthalten ist.

## 8. YAML-Auswirkungen

### Reines GUI-Update

**Keine Änderung am finanziellen YAML notwendig.** Dialoge, Symbole, Reihenfolge und nebeneinanderliegende Controls beeinflussen die Daten nicht.

Bestehende Finanzdaten bleiben beispielsweise:

```yaml
years: 20
inflationRate: 2
currentSavings: 25000
annualReturn: 6
pensionContribution: 200
```

### Darstellungspräferenzen

Präferenzen standardmäßig lokal speichern und nicht mit persönlichen Finanzdaten teilen. Bestehende lokale Einstellungen weiterverwenden bzw. explizit migrieren.

Falls später ein optionaler Export der Ansicht gewünscht ist, wäre folgender **noch nicht unterstützter** Ausschnitt möglich:

```yaml
schemaVersion: 2
viewPreferences:
  projection:
    yearInterval: 10
    valueBasis: both
    cashflowColumns: detailed
  assets:
    view: cards
```

Keine Dialog-Offenstände, Tastaturfokus oder ungespeicherten Formulare in das Finanz-YAML schreiben. Fehlende Ansichtspräferenzen dürfen mit dokumentierten UI-Defaults behandelt werden; ungültige Werte müssen gemeldet werden.

### Spätere Ablösung von „Ruhestand & Vermögen“

Separater, zustimmungspflichtiger Schemawechsel. Beispielausschnitt des Zielmodells, **kein aktuell importierbares Dokument**:

```yaml
schemaVersion: 2
planning:
  horizonYears: 20
  inflationRatePercent: 2
assets:
  - id: savings
    type: cash
    name: Sparguthaben
    snapshot:
      asOfDate: "2026-12-31"
      value: 25000
```

`years` und `inflationRate` wechseln zu `planning`. `currentSavings` wird nach bestätigter Zuordnung ein Asset. `annualReturn` benötigt die Entscheidung, welche Asset-Komponente die Annahme tatsächlich beschreibt; `pensionContribution` benötigt ein Zielprodukt und eine Cashflow-Regel samt Zahlungskonto. Beides nicht stillschweigend entfernen oder automatisch verteilen.

Das Zielmodell muss mit den bestehenden Proposals eine gemeinsame Schema-Version erhalten. Finanzdaten-Migration und optionale Ansichtsexporte sind unabhängig voneinander freizugeben.

## 9. Umsetzung und Tests

Empfohlene Reihenfolge:

1. Zusammenfassung umordnen; volle Breite und responsive Toolbar.
2. Eindeutige Cashflow-Spaltenauswahl statt des Disclosure-Schalters.
3. Asset-Dialog und kompakte Dateiaktionen.
4. Kurzfristiges Layout für „Ruhestand & Vermögen“.
5. Fachliche Ablösung erst nach Umsetzung/Abstimmung der Datenmodell-Proposals.

Akzeptanzkriterien:

- Dialog mit Tastatur bedienbar, Escape/Abbrechen konsistent, Fokus kehrt zurück.
- Ungespeicherte Eingaben werden nicht unbeabsichtigt verworfen.
- Anlegen, YAML-Import/-Export und Clipboard-Verhalten funktionieren unverändert.
- Iconaktionen haben in beiden Sprachen zugängliche Namen.
- Zusammenfassung steht auch in DOM-/Screenreader-Reihenfolge zuerst.
- Toolbar ist bei schmalem Viewport ohne horizontales Seitenscrolling bedienbar.
- Auswahlzustände sind visuell und programmatisch erkennbar.
- Cashflow-Details ändern nur die Spalten, niemals berechnete Beträge.
- Layoutänderungen verändern weder YAML-Finanzdaten noch Prognosewerte.
- Fachliche Migration wird separat auf Datenverlust und Doppelzählung getestet.
