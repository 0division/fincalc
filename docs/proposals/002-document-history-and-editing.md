# Proposal: Finanzdokument, Historie & sichere Bearbeitung

Status: Vorschlag, nicht implementiert. Die YAML-Beispiele beschreiben noch nicht unterstützte Formate.

## 1. Cluster und Priorität

Dieses Proposal bündelt:

- Ungespeichert-Status und lokale Wiederherstellung.
- Rückgängig/Wiederherstellen und wiederherstellbares Löschen.
- Bearbeiten von Assets, Cashflow-Regeln und Ereignissen.
- Stabile IDs, Formatversionierung und verlustfreien YAML-Roundtrip.
- Gemeinsame Validierung für GUI, Import und Wiederherstellung.

Stabile IDs, Validierung und Dokumenttransaktionen werden direkt nach der [GUI](./001-gui-layout-and-interactions.md) als Grundlage für die folgenden Modelländerungen umgesetzt.

## 2. Was YAML-Historisierung leisten kann

Ja: Dieselbe versionierte Dokumentstruktur kann Undo/Redo, frühere Bearbeitungsstände, Wiederherstellung und spätere Szenarien tragen. Keine separate Spezialhistorie für jedes Formular erforderlich.

Aber YAML ist ein Austauschformat, kein Speicherdienst:

- Ein heruntergeladenes YAML wird nicht automatisch bei jeder Änderung aktualisiert.
- Browser-Speicherung ist kein externes Backup und kann gelöscht werden.
- Eine Historie ersetzt keine Validierung, Berechnungsregeln oder Konflikterkennung.
- Die Änderungshistorie ist nicht das fachliche Buchungsjournal: „Asset umbenannt“ ist eine Bearbeitung, „Dividende erhalten“ ein Finanzereignis.

## 3. Einfacher erster Ansatz: validierte Zustands-Snapshots

Zunächst vollständige normalisierte Dokumentzustände statt eines komplexen Patch-/Event-Sourcing-Systems verwenden.

1. Formularänderungen zunächst als Entwurf behandeln.
2. Beim Bestätigen gemeinsam validieren.
3. Eine fachlich zusammengehörige Änderung atomar übernehmen.
4. Vorherigen Zustand in die Undo-Historie aufnehmen.
5. Alle Ansichten aus dem neuen Zustand berechnen.

Ein Asset mit seinen Eingaben ist eine Transaktion, nicht ein Undo-Schritt je Tastendruck. Automatisch übernommene Notizfelder können eine Bearbeitung bis zum Fokuswechsel zusammenfassen.

- Undo stellt den vorherigen gültigen Zustand her; Redo den folgenden.
- Eine neue Änderung nach Undo verwirft den bisherigen Redo-Zweig, nicht den letzten gesicherten Stand.
- Löschen ist eine rückgängig machbare Transaktion. Referenzierte Daten nur mit expliziter Auflösung ihrer Verweise löschen.
- Ein Historieneintrag enthält Revision, Zeitstempel und kurze Beschreibung.
- Historie lokal nach dokumentiertem Speicherbudget begrenzen; Bereinigung sichtbar machen und aktive/gesicherte Wiederherstellungspunkte schützen.
- YAML nur beim Import/Export und optionalen Archivieren serialisieren, nicht bei jedem UI-Lesezugriff neu parsen.

## 4. Speichern und Wiederherstellen

Mindestens drei Zustände getrennt anzeigen:

- Aktueller bearbeiteter Stand.
- Lokal erfolgreich wiederhergestellbarer Stand.
- Zuletzt als Datei exportierter Stand.

Lokale Speicherung optional und ausdrücklich erklären: Finanzdaten verbleiben dabei unverschlüsselt im Browserprofil, sofern keine gesonderte Verschlüsselung umgesetzt wird.

Lokale Sicherung erst nach erfolgreichem Schreibvorgang bestätigen. Speicherfehler, Quoten und konkurrierende Tabs sichtbar melden. Keine Erfolgsmeldung bei gescheitertem Schreiben.

Ein Download bestätigt nur, dass der Browser die Datei erhalten hat; nicht, dass die Datei dauerhaft auf dem Datenträger gespeichert wurde. Die Oberfläche soll entsprechend „Export erstellt“ statt „Backup garantiert“ anzeigen.

Beim Laden einer Datei:

1. Aktuellen unexportierten/ungesicherten Stand prüfen.
2. Datei vollständig parsen und validieren.
3. Ersetzen, Abbrechen oder vorher Exportieren anbieten.
4. Erst danach atomar ersetzen; Import selbst als rückgängig machbare Aktion behandeln.

Eine Verlassen-Warnung ist ergänzend; Browser garantieren ihre Anzeige nicht. Dialogentwürfe getrennt vom gültigen Finanzdokument behandeln.

## 5. Identität und Validierung

- IDs bei Erstellung einmal vergeben und im YAML erhalten.
- Eindeutigkeit und alle Referenzen vor Import prüfen; Duplikate niemals still umnummerieren.
- „Kopie anlegen“ vergibt neue IDs und schreibt interne Referenzen konsistent um.
- Formatversion und Dokumentrevision unterscheiden: Schema beschreibt die Struktur, Revision einen Bearbeitungsstand.
- Unbekannte Schema-Versionen ablehnen. Unbekannte Felder vor verlustbehafteter Übernahme anzeigen; entweder dokumentiert erhalten oder Import blockieren, niemals unbemerkt löschen.
- GUI und Import nutzen dieselben fachlichen Grenzen und Regeln. Ungültig ist nicht automatisch null.
- Datum, Währung, Zahleneinheiten, erlaubte Typen und Referenzen prüfen.
- Daten lesen, migrieren und validieren, bevor der aktive Zustand verändert wird.

## 6. YAML: Dokumentidentität und optionale Historie

Der normale Export bleibt ein lesbarer aktueller Zustand:

```yaml
schemaVersion: 2
document:
  id: plan-main
  revisionId: revision-12
  name: Finanzplanung
planning:
  horizonYears: 20
  inflationRatePercent: 2
assets:
  - id: savings
    type: cash
    name: Rücklage
    snapshot:
      asOfDate: "2026-12-31"
      value: 25000
```

Diese Struktur ergänzt die Zielschemata der anderen Proposals. Bestehende IDs von Komponenten, Kategorien, Personen und Ereignissen werden genauso erhalten. Ergebnisse und UI-Zustände gehören nicht in die Dokumentrevision.

Optionaler separater Historienexport:

```yaml
archiveFormat: fincalc-history
archiveVersion: 1
documentId: plan-main
currentRevisionId: revision-2
revisions:
  - id: revision-1
    parentId: null
    createdAt: "2026-10-29T08:00:00Z"
    description: Ausgangsplanung
    state:
      schemaVersion: 2
      document:
        id: plan-main
        revisionId: revision-1
        name: Finanzplanung
      assets: []
  - id: revision-2
    parentId: revision-1
    createdAt: "2026-10-29T08:05:00Z"
    description: Planung umbenannt
    state:
      schemaVersion: 2
      document:
        id: plan-main
        revisionId: revision-2
        name: Mein Finanzplan
      assets: []
```

Die Archivbeispiele sind minimale Strukturbeispiele, keine vollständigen Finanzpläne. Jede Revision muss bei Implementierung ein vollständiges gültiges Dokument enthalten. Revisionen enthalten nicht wiederum Archive.

Standardmäßig **nur aktuellen Stand teilen**. Die Historie kann gelöschte Namen, sensible Notizen und frühere Finanzdaten enthalten; Archivexport benötigt einen ausdrücklichen Hinweis.

## 7. Migration und Akzeptanz

Alte Dateien erhalten nach bestätigter Migration Dokumentidentität und fehlende Objekt-IDs. Keine erfundene Vergangenheit erzeugen: Der erste importierte Stand ist der Beginn der Historie.

Tests:

- Bearbeiten, Löschen, Import, Undo und Redo stellen exakt gültige Zustände her.
- Fehlgeschlagene Validierung hinterlässt Dokument und Historie unverändert.
- ID-Referenzen bleiben nach Export/Import und Undo erhalten.
- Entwurf, gültiger Stand, lokale Sicherung und Exportstatus sind unterscheidbar.
- Speicherfehler und parallele Tab-Änderungen werden nicht verschwiegen.
- Normaler Export enthält keine historische oder gelöschte Information.
- Archiv-Roundtrip und Migration älterer Revisionen sind getestet.
