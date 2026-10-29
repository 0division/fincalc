# Proposal: Hierarchische Cashflows und gemeinsame Asset-Planung

Status: Vorschlag, keine Änderung an der Anwendung oder am aktuellen YAML-Format.

## 1. Idee: ähnlich bedienbar, fachlich nicht identisch

Cashflows sollen genauso flexibel anlegbar sein wie Assets: mit Namen, Kategorien, Zeiträumen, Regeln, Änderungen und Notizen statt fest verdrahteter Felder für Gehalt, Lebensmittel oder Versicherung.

Die Gemeinsamkeit ist die **Finanzplanung**, nicht die Gleichsetzung aller Elemente mit Vermögen:

| Element | Bestand? | Geldfluss? | Beispiel |
|---|---|---|---|
| Asset | Ja | Optional durch Komponenten/Buchungen | Depot, Immobilie, Girokonto |
| Verbindlichkeit | Ja, als Schuld | Aufnahme, Zins, Tilgung | Kredit |
| Einkommensregel | Nein | Wiederkehrender Zufluss | Gehalt, Nebenjob |
| Ausgabenregel | Nein | Wiederkehrender Abfluss | Lebensmittel, Versicherung |
| Kategorie | Nein | Nur Summe ihrer Nachfolger | Lebenshaltung, Wohnen |
| Asset-Komponente | Abhängig vom Typ | Optional | Wertsteigerung, Dividende, Gebühr |

**„Income“ ist damit normalerweise kein Asset**, sondern eine Regel für Einnahmen. Offene Gehaltsforderungen können als eigener Bestand modelliert werden, aber nicht automatisch als kapitalisierter Wert aller zukünftigen Gehälter.

**Lebensmittel sind normalerweise kein Kredit**, sondern Konsumausgaben. Werden sie mit einer Kreditkarte bezahlt, entstehen Konsum und eine Verbindlichkeit; die spätere Kartenabrechnung ist eine Tilgung, nicht erneut Lebensmittelaufwand. Diese Ähnlichkeit spricht für gemeinsame Buchungen, nicht für identische Asset-Typen.

## 2. Gemeinsame Bausteine

Cashflow-Regeln und die [Asset-Komponenten](./005-asset-performance-income-and-costs.md) nutzen dieselben Bausteine:

- Stabile IDs, Name, Notizen und Tags.
- Gültigkeitszeitraum, Frequenz und Zahlungstermin.
- Festbetrag oder validierte Berechnung anhand einer expliziten Basis.
- Explizite Indexierung statt pauschaler Inflation aller Geldflüsse.
- Zeitlich wirksame Änderungen und Aktivierung für Szenarien.
- Verknüpfungen zu Person, Kategorie und betroffenen Assets/Konten.

Keine universelle Klasse erzwingen: Bestände, Kategorien, Regeln und Buchungen behalten unterscheidbare Datentypen. Gemeinsame Formularfelder und Rechenhelfer wiederverwenden.

## 3. Hierarchische Kategorien

Kategorien bilden einen frei erweiterbaren Baum:

```text
Einnahmen
  Erwerbseinkommen
    Hauptberuf
    Nebenjob
  Kapitalerträge
Ausgaben
  Lebenshaltung
    Lebensmittel
    Mobilität
  Wohnen
    Miete
    Energie
  Steuern
Kapitalbewegungen
  Sparen
  Tilgung
```

- Kategorien enthalten Unterkategorien und/oder zugeordnete Regeln, aber keinen eigenen gebuchten Betrag.
- Jede Regel hat genau eine primäre Kategorie. Tags erlauben zusätzliche, nicht additive Sichten.
- Kategorien per stabiler `parentId` verbinden; keine Namenspfade als Identität.
- Zyklen, unbekannte Eltern, doppelte IDs und Verweise auf gelöschte Kategorien verhindern.
- Summen werden aus Blattbuchungen berechnet. Beim Aufsummieren nicht gleichzeitig Kategorie und ihre Kinder addieren.
- Löschen einer belegten Kategorie verlangt Umhängen der Regeln/Unterkategorien oder eine ausdrücklich bestätigte Löschentscheidung.
- Kategorien können optional Budgets besitzen. Ein Budget ist ein Vergleichswert, kein zusätzlicher Zahlungsstrom.

## 4. Regeln, Asset-Verknüpfung und ein gemeinsames Journal

Cashflow-Regeln beschreiben geplante Zahlungen. Asset-Komponenten können solche Zahlungen ebenfalls erzeugen. Alle erzeugten und tatsächlichen Vorgänge gehen in **ein gemeinsames Journal**.

Jede Journalbuchung kennt Quelle, Zeitraum, Kategorie und ihre finanziellen Gegenstellen:

- Externes Gehalt -> Girokonto: Haushaltseinnahme.
- Girokonto -> Lebensmittelanbieter: Haushaltsausgabe.
- Girokonto -> Depot: interne Kapitalbewegung, kein Konsumaufwand.
- Dividende aus Depot-Komponente -> Girokonto: Kapitalertrag, genau einmal.
- Kreditaufnahme -> Girokonto und entsprechende Schuldzunahme: Finanzierung, kein Einkommen.
- Girokonto -> Kredittilgung: Vermögens-/Schuldumschichtung, kein Zinsaufwand.

Eine Zahlung hat genau einen Erzeuger: entweder eine unabhängige Cashflow-Regel oder eine Asset-Komponente. Asset-Erträge im Cashflow-Editor erscheinen als verknüpfte Zeilen, nicht als zweite kopierte Regel. Änderungen öffnen die ursprüngliche Quelle.

Ist-Buchungen ersetzen explizit zugeordnete Planbuchungen; eine bloße Namensähnlichkeit reicht für den Abgleich nicht aus.

Für den Einstieg genügt ein gemeinsames Geldkonto; dessen Anfangsbestand muss bestätigt werden. Ein fiktives Konto darf fehlende Liquidität nicht verbergen. Ein negativer Geldbestand wird als Finanzierungslücke angezeigt, nicht still auf null begrenzt.

## 5. Auswertung und Bedienung

Die volle Breite nutzende Cashflow-Box zeigt einen aufklappbaren Kategorienbaum:

- Kategorie/Unterkategorie und Regel hinzufügen, bearbeiten, verschieben, deaktivieren.
- Pro Regel Betrag, Zahlungsrhythmus, Beginn/Ende, Konto und Indexierung.
- Einzelne Regeln aufklappen, um zukünftige Änderungen zu planen.
- Asset-generierte Regeln mit Herkunftslink und Status „vom Asset berechnet“.
- Filtern nach Kategorie einschließlich Nachfolgern, Person, Asset, Tags, Zeitraum und Erzeuger.
- Getrennte Summen für Einnahmen, Konsum/Kosten, Steuern, Sparen und Finanzierung.
- Darstellung nominal oder inflationsbereinigt; Indexierung und Anzeigebereinigung sind getrennte Funktionen.

Filter verändern nur die Ansicht. Eine Szenario-Deaktivierung verändert die Rechnung und muss gesondert sichtbar sein.

„Verfügbar nach Konsum und Steuern“, „nach Sparen“ und „Liquiditätsänderung inklusive Finanzierung“ sind unterschiedliche Kennzahlen. Sie dürfen nicht unter einem unklaren „Netto“ vermischt werden.

## 6. YAML: heute und vorgeschlagene Änderung

Alle folgenden Beispiele sind illustrative Zielschemata. `schemaVersion: 2` bezeichnet den gemeinsam abzustimmenden nächsten Formatentwurf, nicht einen bereits unterstützten Import.

### Heute: feste Felder

```yaml
salary: 72000
sideIncome: 250
food: 500
transport: 220
investment: 600
```

Diese Form kann weder zwei Gehälter noch Unterkategorien oder unterschiedliche Zahlungszeiträume angemessen beschreiben.

### Ziel: Kategorien, Regeln und Asset-Referenzen

```yaml
schemaVersion: 2
currency: EUR
cashflowCategories:
  - id: income
    name: Einnahmen
    parentId: null
  - id: employment
    name: Erwerbseinkommen
    parentId: income
  - id: expenses
    name: Ausgaben
    parentId: null
  - id: living
    name: Lebenshaltung
    parentId: expenses
  - id: food
    name: Lebensmittel
    parentId: living
  - id: transfers
    name: Kapitalbewegungen
    parentId: null
assets:
  - id: checking
    type: cash
    name: Girokonto
    snapshot:
      asOfDate: "2026-12-31"
      value: 5000
  - id: portfolio
    type: wealth
    subtype: etf-portfolio
    name: Depot
    snapshot:
      asOfDate: "2026-12-31"
      value: 40000
cashflowRules:
  - id: salary-main
    name: Hauptberuf
    categoryId: employment
    kind: income
    incomeBasis: net
    schedule:
      startDate: "2027-01-01"
      frequency: monthly
      dayOfMonth: 28
    calculation:
      type: fixed
      amount: 3000
    destinationAssetId: checking
    indexation:
      type: none
  - id: groceries
    name: Lebensmitteleinkäufe
    categoryId: food
    kind: expense
    schedule:
      startDate: "2027-01-01"
      frequency: monthly
      dayOfMonth: 1
    calculation:
      type: fixed
      amount: 500
    sourceAssetId: checking
    indexation:
      type: annual
      ratePercent: 2
      firstAdjustmentDate: "2028-01-01"
  - id: savings-plan
    name: ETF-Sparplan
    categoryId: transfers
    kind: transfer
    schedule:
      startDate: "2027-01-01"
      frequency: monthly
      dayOfMonth: 28
    calculation:
      type: fixed
      amount: 600
    sourceAssetId: checking
    destinationAssetId: portfolio
    indexation:
      type: none
cashflowRuleChanges:
  - id: groceries-change
    ruleId: groceries
    effectiveDate: "2027-07-01"
    sequence: 0
    type: amount-change
    amount: 550
```

Beträge sind positive EUR-Werte. `kind` und Gegenstellen bestimmen die Richtung. Der dargestellte Zeitplan beschreibt Solltermine; die erste Monatsprojektion behandelt sie entsprechend der dokumentierten Monatskonvention des Buchungs-Proposals, nicht als tagesgenaue Liquidität.

Ein Betragswechsel ersetzt den nominalen Regelbetrag ab Wirksamkeit; eine bereits definierte Indexierung startet nicht unbemerkt neu. Reihenfolge von Änderung und Indexierung bei gleichem Termin muss vor Implementierung spezifiziert und getestet werden.

Generierte Journalzeilen sind abgeleitete Ergebnisse und werden standardmäßig nicht als zweite Datenquelle im Planungs-YAML gespeichert. Tatsächliche Buchungen benötigen eine eigene Sammlung mit Quellreferenzen und Abgleichstatus.

## 7. Migration und Zusammenspiel der Proposals

- Feste Einnahmen-/Ausgabenfelder in benannte Regeln migrieren und ihre ursprünglichen Jahres-/Monatsbeträge erhalten.
- Altes `salary` ist als Bruttogehalt beschriftet. Nicht still als Nettogeldeingang migrieren: entweder als Bruttoannahme mit noch ungeklärtem Nettofluss markieren oder eine ausdrückliche Umstellung verlangen.
- Einzahlungen aus `investment`, `pensionContribution` und `asset.monthlyContribution` auf Überlappungen prüfen; nicht automatisch alle addieren.
- Das bisherige Asset `type: income` prüfen: wiederkehrende Zahlung in Regel überführen; einen vorhandenen Bestandswert nicht ohne Entscheidung löschen oder als Einnahme interpretieren.
- „Miete / Kreditrate“ muss in Miete oder Zins-/Tilgungsplan aufgeteilt werden; kein automatisches Raten.
- ID-Referenzen beim Import vollständig validieren und Änderungen atomar übernehmen.
- Eine abgestimmte Schema-Version für Kategorien, Assets, Komponenten, Ereignisse und Steuerannahmen verwenden.

Siehe [Buchungen & Änderungen](./003-asset-transactions-and-changes.md), [Wertentwicklung, Erträge & Kosten](./005-asset-performance-income-and-costs.md) und [Steuerberechnung](./007-tax-calculations.md). Geldflüsse und Besteuerung werden aus derselben fachlichen Quelle abgeleitet, nicht unabhängig pro Bildschirm neu berechnet.

## 8. Umsetzung und Akzeptanz

1. Kategorien/Regeln, Validierung und vollständigen YAML-Roundtrip implementieren.
2. Feste bestehende Felder mit bestätigter Migration ersetzen.
3. Gemeinsames Journal und Asset-Verknüpfungen einführen.
4. Änderungen, Indexierung und Szenarien ergänzen.
5. Asset-Komponenten und unterstützte Steuerzahlungen integrieren.

Tests:

- Beliebige Unterkategorien und mehrere Einkommensquellen funktionieren.
- Umbenennen/Verschieben erhält Referenzen; Kategorienzyklen werden abgelehnt.
- Kategoriensummen zählen jede Buchung genau einmal.
- Sparplan verschiebt Giro-/Depotbestand, verändert aber nicht das Haushaltsnettovermögen.
- Lebensmittelkauf reduziert Liquidität; Kreditkartenabrechnung zählt Konsum nicht erneut.
- Asset-Ertrag erscheint genau einmal im Cashflow und bleibt zu seiner Quelle navigierbar.
- Jahres-/Monatsbeträge, Beginn/Ende, Änderungen und Indexierung stimmen an Grenzen.
- Brutto-/Nettoeinkommen und Steuerzahlungen werden nicht doppelt belastet.
- YAML-Roundtrip erhält Baum, Regeln, IDs, Referenzen und Änderungen.
- Anzeige filtern lässt Berechnung unverändert; Szenario-Deaktivierung nicht.
