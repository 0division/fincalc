# Proposal: Wertentwicklung, Erträge & Kosten

Status: Vorschlag, keine Änderung an der Anwendung.

## 1. Ziel und Begriffe

Ein einzelnes Feld `interestRate` reicht für die Entwicklung eines Assets nicht aus. Eine Immobilie kann gleichzeitig im Wert steigen, Miete einbringen und Instandhaltung kosten. Ein Depot kann Kursgewinne, Dividenden und Gebühren haben. Ein Kredit verursacht Zinsen, während seine Tilgung die Verbindlichkeit reduziert.

Vorgeschlagener Name in der Oberfläche:

- Deutsch: **Wertentwicklung, Erträge & Kosten**
- Englisch: **Value development, income & costs**
- Technisch: `components` als Sammlung von Entwicklungskomponenten pro Asset.

Nicht alles „Zinsen“ nennen:

| Kategorie | Beispiele | Wirtschaftliche Bedeutung |
|---|---|---|
| Wertänderung | Kursentwicklung, Immobilienwert, Abschreibung | Veränderung des bewerteten Vermögens ohne unmittelbaren Geldfluss |
| Ertrag | Guthabenzins, Dividende, Miete, Ausschüttung | Einnahme, die ausgezahlt oder im Asset behalten werden kann |
| Kosten | Verwaltung, Depotgebühr, Instandhaltung, Kreditzins | Aufwand mit expliziter Zahlungsquelle |
| Förderung | Zulage, Zuschuss | Separater Zufluss, kein Investmentertrag |
| Steuer | Steuerzahlung, Erstattung | Separater Vorgang mit eigener steuerlicher Einordnung |
| Kapitalbewegung | Einzahlung, Entnahme, Tilgung, Umbuchung | Veränderung der Kapitalzuordnung, kein Ertrag und keine Kosten |

„Gewinn“ ist eine abgeleitete Kennzahl, kein eindeutiger Komponententyp: Ertrag, unrealisierter Wertzuwachs und steuerpflichtiger Veräußerungsgewinn sind verschiedene Größen.

## 2. Beispiele

### Vermietete Immobilie

- Wertsteigerung: angenommene 2 % pro Jahr auf den Immobilienwert.
- Mietertrag: 1.000 EUR monatlich, auf das Haushaltskonto ausgezahlt.
- Verwaltung: 50 EUR monatlich, extern bezahlt.
- Instandhaltung: 1.200 EUR jährlich, extern bezahlt.
- Finanzierung: eigenes Kredit-Asset mit Zinsaufwand und Tilgung, nicht pauschal vom Immobilienwert abziehen.

### ETF-Portfolio

- Kursentwicklung: angenommene 4 % pro Jahr, ausdrücklich ohne Ausschüttungen.
- Ausschüttung: angenommene 2 % jährlich, ausgezahlt oder wiederangelegt.
- Externe Depotgebühr: 30 EUR jährlich.
- Fondskosten: separat ausweisen, aber nur zusätzlich abziehen, wenn sie nicht bereits in der verwendeten Rendite enthalten sind.

### Sparguthaben und Kredit

- Sparguthaben: vertraglicher Guthabenzins mit festgelegter Zinsgutschrift.
- Kredit: Zinsaufwand auf die Restschuld; Tilgung als gesonderte Kapitalbewegung.
- Eine monatliche Kreditrate kann Zins und Tilgung enthalten. Die Annuität muss aufgeteilt werden; niemals zusätzlich die vollständige Rate und die Zinsen als Aufwand zählen.

Alle Zahlen sind illustrative Annahmen, keine Prognosen oder Produktzusagen.

## 3. Komponentenmodell

Jede Komponente erhält:

- Stabile ID, Name und Kategorie.
- Einen fachlichen Typ, z. B. `price-growth`, `interest-income`, `dividend`, `rent`, `management-fee`, `maintenance` oder `loan-interest`.
- Gültigkeitsbeginn und optionales Ende.
- Berechnungsart: fester Geldbetrag oder Prozentsatz einer definierten Basis.
- Zahlungs-/Bewertungsfrequenz und expliziten Zeitbezug.
- Abwicklung: Wertänderung, Gutschrift/Belastung im Asset oder Zahlung über ein verknüpftes Geldkonto.
- Aktivierungsstatus und optionale benutzerdefinierte Tags.
- Herkunft: manuelle Annahme, Produktvoreinstellung oder importierter Wert.
- Hinweis, ob es sich um eine Vertragskondition oder eine unsichere Prognose handelt.

Typabhängige Felder statt eines einzigen „Betrag / Zinssatz“-Feldes:

| Berechnungsart | Felder |
|---|---|
| Festbetrag | Betrag in EUR, Frequenz, Zahlungstermin |
| Erwartete Wertentwicklung | Effektive Jahresrate, Bewertungsbasis |
| Ertragsrendite | Jahresrate, Bezugswert, Ausschüttungsfrequenz |
| Vertraglicher Zins | Jahresrate, nominal/effektiv, Verzinsungs- und Abrechnungskonvention |
| Prozentuale Kosten | Jahresrate, Kostenbasis, Belastungsfrequenz |

Basen müssen eindeutig sein, beispielsweise Anfangswert des Monats, Anfangswert des Jahres, Anschaffungskosten oder Restschuld. „2 %“ ohne Basis ist unvollständig.

Nicht in der ersten Version vorsehen: frei ausführbare Formeln oder JavaScript im YAML.

## 4. Renditeumfang und Doppelzählung

Ein Asset wählt einen expliziten Renditemodus:

1. **Gesamtrendite:** Die Annahme enthält bereits bestimmte Ertrags- und Kostenbestandteile.
2. **Getrennte Komponenten:** Kursentwicklung, Erträge und Kosten werden getrennt berechnet.

Zusätzlich müssen enthaltene Bestandteile ausgewiesen werden, etwa Ausschüttungen und laufende Fondskosten.

- Historische Gesamtrendite plus Dividendenrendite darf nicht unbemerkt als zusätzliche Gesamtrendite summiert werden.
- Bereits enthaltene Kosten dürfen als Information sichtbar sein, erzeugen aber keine zweite Belastung.
- Ausgezahlte Erträge einer Gesamtrendite müssen aus der Wertentwicklung herausgerechnet werden; sie dürfen nicht zusätzlich zum vollständigen Wertzuwachs entstehen.
- Kann das Modell eine Gesamtrendite nicht verlässlich zerlegen, die Kombination mit separaten Auszahlungen blockieren und eine getrennte Annahme verlangen.
- Einzahlungen, Entnahmen und Tilgungen bleiben von der Performance getrennt.
- Aktivierungsänderungen und Modellwechsel zeigen eine Vorschau und eventuelle Konflikte.

## 5. Berechnung und Abrechnung

An den gemeinsamen monatlichen Simulationsansatz des [Buchungs-Proposals](./003-asset-transactions-and-changes.md) anschließen.

1. Explizite Ereignisse und Konditionsänderungen am Monatsanfang anwenden.
2. Relevante Berechnungsbasen bestimmen und für den Zeitraum fixieren.
3. Wertänderung, Ertragsansprüche und Kosten anhand dieser Basen berechnen.
4. Fällige Zahlungen/Gutschriften zum definierten Termin buchen.
5. Wiederanlage, Einzahlungen und Entnahmen als nachvollziehbare Kapitalbewegungen abwickeln.

Erwartete effektive Wertsteigerung kann mit `(1 + r) ** (1 / 12) - 1` monatlich umgerechnet werden. Eine jährlich ausgezahlte Ertragsrendite darf dagegen nicht ohne definierte Wiederanlage wie monatlich verzinste Wertsteigerung behandelt werden. Vertragszinsen brauchen ihre tatsächliche Konvention.

### Entstehung und Zahlung trennen

Eine jährlich ausgezahlte Zins- oder Mietforderung darf nicht zugleich als Forderung und erneut als Zahlung zum Vermögen addiert werden. Dafür entweder Forderungen/Verbindlichkeiten explizit führen oder die erste Version klar als zahlungsorientiertes Modell begrenzen.

Beispiel für 100 EUR Dividende:

- Auszahlung: 100 EUR auf das Geldkonto, kein zusätzlicher Verbleib im Investment.
- Wiederanlage: 100 EUR Ertrag, anschließend 100 EUR Umbuchung in das Investment; kein zusätzlicher externer Haushaltszufluss.
- Ausschüttung aus einem bereits inklusive Dividende bewerteten Bestand: entsprechende Abnahme des Bestands berücksichtigen.

Extern bezahlte Instandhaltung reduziert das Geldkonto, nicht automatisch den Marktwert der Immobilie. Eine kostenfinanzierte Aufwertung ist eine eigene Bewertungsannahme, nicht die automatische Gegenbuchung jeder Ausgabe.

### Abstimmung

Für jedes Asset muss gelten:

`Endbestand = Anfangsbestand + Netto-Kapitalbewegungen + Wertänderungen + einbehaltene Erträge - intern belastete Kosten/Steuern + intern gutgeschriebene Förderung`

Diese Darstellung gilt für den bewerteten Asset-Bestand. Separat geführte Forderungen/Verbindlichkeiten benötigen eigene Bestandsbrücken. Kosten, die ausdrücklich als Erhöhung einer Kreditschuld gebucht werden, brauchen ebenfalls eine eigene Verbindlichkeitslogik.

Auf Haushaltsebene interne Umbuchungen eliminieren. Externe Zahlungen nur einmal berücksichtigen, egal ob das Geldkonto separat als Asset angezeigt wird.

## 6. Filter, Anzeige und Kennzahlen

Komponenten und erzeugte Buchungen nach folgenden Dimensionen filtern:

- Asset und Asset-Typ.
- Kategorie und fachlicher Komponententyp.
- Zeitraum und Phase, z. B. Ansparen oder Entnahme.
- Wertänderung ohne Geldfluss versus tatsächlicher Geldfluss.
- Ausgezahlt, einbehalten/wiederangelegt oder extern bezahlt.
- Vertragskondition versus Prognose.
- Tags, beispielsweise „Immobilie“, „Verwaltung“ oder „Altersvorsorge“.

Die Hauptprojektion bietet Ansichten:

- **Vermögensentwicklung:** Kapitalbewegungen und Performance getrennt.
- **Cashflow:** Erträge, Kosten und Nettozahlungen.
- **Ertrags- und Kostenübersicht:** Summe je Kategorie/Komponente.
- **Detailansicht:** Rechenbasis, Satz, Betrag, Abwicklung und Herkunft.

Ein Anzeigefilter ändert niemals die zugrunde liegende Berechnung. Für ein echtes Szenario muss eine Komponente ausdrücklich deaktiviert werden; dies ist eine andere Aktion als „ausblenden“.

Absolute Brutto-/Nettoergebnisse zunächst in EUR zeigen. Prozentuale Gesamtrenditen erst mit dokumentierter Methodik, z. B. zeit- oder geldgewichtet, ergänzen. Prozentwerte mit unterschiedlichen Basen dürfen nicht einfach addiert werden.

## 7. Zusammenspiel mit Ereignissen und Steuern

- Komponenten definieren wiederkehrende Regeln; Ereignisse ändern sie oder beschreiben einzelne Vorgänge.
- Eine Zinsänderung referenziert die konkrete Komponente über `componentId`, nicht nur das Asset.
- Änderungen werden zeitlich versioniert statt rückwirkend über die ganze Historie angewandt.
- Erzeugte Buchungen tragen Komponent-ID und Zeitraum, damit sie nachvollziehbar und beim Neuberechnen nicht dupliziert werden.
- Manuell erfasste Ist-Buchungen und simulierte Buchungen brauchen eine explizite Abgleichregel; nicht beide für denselben Vorgang zählen.
- Der [Steuer-Proposal](./007-tax-calculations.md) bestimmt steuerliche Folgen anhand strukturierter Sachverhalte. Eine positive Wertsteigerung allein ist keine automatisch steuerpflichtige Auszahlung.
- Förderung und Steuererstattung bleiben von der Investmentperformance unterscheidbar.
- Freitext zu Freibeträgen und Förderung bleibt eine Notiz und wird nicht automatisch in Rechenlogik übersetzt.

## 8. YAML, Migration und Umsetzung

Eine neue Schema-Version speichert Komponenten, Gültigkeit, Konventionen, Renditemodus und referenzierende Ereignisse vollständig.

Bestehendes `interestRate` nicht ohne Rückfrage aufteilen: Es kann heute erwartete Rendite oder Kreditzins bedeuten. Migration zeigt den bisherigen Wert und verlangt eine passende Einordnung. Alte Notizen und Ereignisse erhalten; mehrdeutige Zuordnungen sichtbar machen.

Empfohlene Reihenfolge:

1. Komponentenmodell mit Validierung und vollständigem YAML-Roundtrip.
2. Wertänderung, ausgezahlter/einbehaltener Ertrag und feste Kosten.
3. Gemeinsames Buchungsjournal und abgestimmte Asset-/Haushaltsprojektion.
4. Komponentenbezogene Ereignisse, Filter und Detailansichten.
5. Vertragskonventionen, Kreditamortisation und komplexere Steuer-/Fördermodelle.

## 9. YAML-Änderung: mehrere Komponenten statt eines Zinssatzes

Heute:

```yaml
assets:
  - type: etf
    name: Depot
    value: 40000
    interestRate: 6
```

Vorgeschlagener Ausschnitt des nächsten Schemas, noch nicht importierbar:

```yaml
schemaVersion: 2
assets:
  - id: portfolio
    type: wealth
    subtype: etf-portfolio
    name: Depot
    snapshot:
      asOfDate: "2026-12-31"
      value: 40000
    returnModel:
      mode: separate-components
    components:
      - id: price-growth
        name: Kursentwicklung ohne Ausschüttung
        category: value-change
        type: price-growth
        effectiveFrom: "2027-01-01"
        calculation:
          type: effective-annual-rate
          annualRatePercent: 4
          basis: opening-month-value
        settlement: valuation
      - id: dividend
        name: Ausschüttung
        category: income
        type: dividend
        effectiveFrom: "2027-01-01"
        calculation:
          type: annual-yield
          annualRatePercent: 2
          basis: opening-year-value
        schedule:
          frequency: annual
          month: 12
          dayOfMonth: 31
        settlement: external
        destinationAssetId: checking
        categoryId: capital-income
      - id: custody-fee
        name: Depotgebühr
        category: cost
        type: management-fee
        effectiveFrom: "2027-01-01"
        calculation:
          type: fixed
          amount: 30
        schedule:
          frequency: annual
          month: 12
          dayOfMonth: 31
        settlement: external
        sourceAssetId: checking
        categoryId: investing-costs
```

Neu sind ein expliziter Renditemodus, mehrere benannte Komponenten mit eigenen Basen und Zahlungswegen sowie stabile Referenzen. `checking`, `capital-income` und `investing-costs` verweisen auf Konto/Kategorien aus dem [Cashflow-Modell](./004-hierarchical-cashflows-and-assets.md), die in diesem Ausschnitt nicht mit abgebildet sind. Ein vollständiger Import muss sie auflösen.

Die Ausschüttungsannahme ist zusätzlich zur ausdrücklich ausschüttungsfreien Kursentwicklung definiert. Extern bezahlte Gebühren mindern das Geldkonto statt den Depotwert. `category` beschreibt die wirtschaftliche Komponentenklasse; `categoryId` ordnet die Buchung dem benutzerdefinierten Kategorienbaum zu.

## 10. Akzeptanztests

- Immobilie: Wertsteigerung ändert den Bestand, Miete nur den vereinbarten Zahlungsweg.
- Gebühren aus dem Depot versus extern bezahlte Gebühren wirken auf die richtigen Konten.
- Dividenden werden bei Auszahlung und Wiederanlage jeweils genau einmal berücksichtigt.
- Gesamtrendite plus bereits enthaltene Ausschüttungen/Kosten erzeugt einen Konflikt statt Doppelzählung.
- Beitrag und Tilgung werden nicht als Rendite oder Aufwand fehlklassifiziert.
- Zinsänderung betrifft nur die referenzierte Komponente und ihren Gültigkeitszeitraum.
- Jahreszahlung und monatliche Zahlung folgen ihrer ausdrücklich definierten Konvention.
- Ist- und Planbuchungen desselben Vorgangs werden nicht doppelt berücksichtigt.
- Asset-Bestandsbrücke und Haushaltsabstimmung stimmen über mehrere Perioden.
- Anzeige filtern verändert weder Endvermögen noch Cashflow; Deaktivieren erzeugt dagegen ein neues Szenario.
- YAML-Roundtrip erhält IDs, Datentypen, Konventionen und Ereignisreferenzen.
- Beide Sprachen unterscheiden Vertragszins, Renditeannahme, Auszahlung, Wertänderung und Kosten.
