# Proposal: Personen, Haushalt & vergleichbare Szenarien

Status: Vorschlag, nicht implementiert. YAML-Beispiele zeigen noch nicht unterstützte Zielstrukturen.

## 1. Cluster

Dieses Proposal bündelt mehrere Personen und Kinder, Eigentums-/Zahlungszuordnung und Szenariovergleiche. Grundlage sind [Dokumentidentität und Revisionen](./002-document-history-and-editing.md), [Cashflow-Regeln](./004-hierarchical-cashflows-and-assets.md) und die jeweiligen Modell-Proposals.

Die Personenstruktur bereits bei den vorhergehenden Datenmodellschritten mitentwerfen; vollständige Haushaltsoberfläche und Szenariovergleiche folgen in diesem Schritt.

Historie beantwortet „Was habe ich geändert?“. Ein Szenario beantwortet „Was wäre, wenn?“. Beide können vollständige Dokumentzustände verwenden, sind aber unterschiedliche Bedienkonzepte.

## 2. Haushalt und Personen

- Personen unabhängig von „Single/Paar“ erfassen; Kinder als Personen mit passender Rolle und Geburtsdatum.
- Keine willkürliche fachliche Kinderzahlgrenze; notwendige technische Importgrößenlimits getrennt begründen.
- Eigentum, Zahlungskonto und steuerliche Zuordnung nicht gleichsetzen.
- Gemeinschaftliches Vermögen einmal führen und Eigentumsanteile referenzieren, nicht für jede Person kopieren.
- Beteiligungsanteile vollständig und widerspruchsfrei erfassen. Nicht modellierte externe Miteigentümer benötigen eine ausdrückliche Kennzeichnung.
- Kinderbetreuung, Unterhalt und Haushaltswechsel können später datierte Beziehungen erhalten; keine aktuelle Beziehung rückwirkend für alle Jahre annehmen.
- Steuerliche Kinderberechtigung und Freibetragsanteile separat bestimmen; nicht automatisch aus Kinderzahl oder Rolle ableiten.

## 3. Szenarien zunächst als benannte Kopien

Erste Version: eine benannte vollständige Kopie einer bestätigten Basisrevision. Keine vererbbaren Patch-Ketten und kein stilles Nachziehen von Basisänderungen.

- Basis und Szenario besitzen gemeinsame Herkunftsinformation.
- Innerhalb getrennt ausgewerteter Dokumente können Objekt-IDs erhalten bleiben, damit Unterschiede zuordenbar sind.
- Eine Szenariokopie erhält eine neue Dokument-ID; ein Asset-Duplikat innerhalb desselben Dokuments dagegen eine neue Asset-ID.
- Änderungen am Szenario verändern die Basis nicht.
- „Auf aktuelle Basis übertragen“ ist später ein bewusster Abgleich mit Konfliktanzeige.
- Historie speichert Bearbeitungsschritte eines Szenarios; Szenarien werden nicht als reine Redo-Zweige versteckt.

Vergleich nur bei gleichen Bewertungsdaten, Zeiträumen, Währungen und Wertdarstellungen. Unterschiedliche Steuerregel-Versionen und Annahmen sichtbar markieren.

Erste Vergleichsansicht: Basiswert, Szenariowert und absolute Differenz für Liquidität, Vermögen, Kosten und relevante Steuern. Prozentdifferenzen bei Basis null nicht erfinden. Zu jeder Differenz die geänderten Annahmen zeigen.

## 4. YAML: Personen und Eigentum

Das bestehende einzelne `name`/`birthDate` wird in eine referenzierbare Personenliste überführt. Der Haushaltsstatus bleibt beschreibend und ersetzt keine Steuer-Veranlagungsentscheidung:

```yaml
schemaVersion: 2
document:
  id: household-plan
  revisionId: revision-1
  name: Haushaltsplanung
persons:
  - id: adult-a
    name: Person A
    birthDate: "1990-01-15"
  - id: adult-b
    name: Person B
    birthDate: "1991-04-20"
  - id: child-a
    name: Kind A
    birthDate: "2020-06-10"
household:
  members:
    - personId: adult-a
      role: adult
    - personId: adult-b
      role: adult
    - personId: child-a
      role: child
assets:
  - id: joint-savings
    type: cash
    name: Gemeinsame Rücklage
    ownership:
      - personId: adult-a
        sharePercent: 50
      - personId: adult-b
        sharePercent: 50
    snapshot:
      asOfDate: "2026-12-31"
      value: 20000
```

Dies ist ein Ausschnitt: Cashflow-Regeln können mit `personId` eine Einkommensquelle zuordnen; Steuerannahmen referenzieren dieselben Personen gemäß [Steuer-Proposal](./007-tax-calculations.md). Eigentumsanteile allein legen keine steuerliche Behandlung fest.

## 5. YAML: Szenarioherkunft statt eingebetteter Historie

Ein Szenario wird als eigenes vollständiges Finanzdokument exportiert. Zusätzliche Herkunft:

```yaml
schemaVersion: 2
document:
  id: scenario-part-time
  revisionId: scenario-revision-1
  name: Teilzeit ab 2030
scenario:
  baseDocumentId: household-plan
  baseRevisionId: revision-1
  description: Geringeres Einkommen ab 2030
cashflowRuleChanges:
  - id: part-time-change
    ruleId: salary-main
    type: amount-change
    effectiveDate: "2030-01-01"
    sequence: 0
    amount: 2200
```

Auch dies ist ein Ausschnitt: Der echte Export enthält insbesondere die referenzierte Gehaltsregel und alle weiteren Modelldaten. Kein Import darf auf eine fremde Basisdatei angewiesen sein, um das Szenario auszuwerten. Herkunft bedeutet nicht automatische Vererbung. Für einen historischen Differenzvergleich muss die Basisrevision zusätzlich verfügbar sein; andernfalls nur die Szenariorechnung anbieten und fehlende Basis melden.

## 6. Migration und Tests

- Bestehende persönliche Daten in eine Person migrieren; keine Partner/Kinder erfinden.
- Ungeklärte Eigentums-/Steuerzuordnung anzeigen, nicht automatisch gleich verteilen.
- Vorhandener Kinderfreibetragszähler bleibt als Altangabe erhalten, bis die konkrete Zuordnung geklärt ist.
- Szenarien erst nach stabilen IDs und reproduzierbarer gemeinsamer Rechnung freigeben.

Tests: Anteile und Referenzen validieren; gemeinsames Vermögen einmal zählen; Basiskopie bleibt unverändert; identische Szenarien liefern Differenz null; Änderungen wirken erst ab Datum; YAML-Roundtrip erhält Herkunft und Personen; fehlende Basis verhindert nur Vergleich, nicht eigenständige Rechnung.
