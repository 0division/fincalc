# fincalc.de

A personal finance calculator for German private individuals to plan cash flow, taxes, assets, and long-term wealth.

## Running locally

Select **Launch fincalc** in VS Code's **Run and Debug** menu and press **F5**. This runs `npm run start:debug` on an automatically assigned available port and opens VS Code's integrated browser at that address when the server is ready. Python 3 and npm must be available. Existing servers on port 8000 do not prevent this launch.

Alternatively, run `npm start` and open `http://localhost:8000/` manually.

## YAML files

- **Load** opens a local YAML file and restores personal data, assets, events, and notes. Invalid files show an error without partially applying their contents.
- **Save** downloads the current data as `fincalc.yaml`.
- **Share YAML** copies current data to the clipboard. Clipboard access requires a supported browser and HTTPS or localhost; denied/unavailable access is reported explicitly.
- **Show** opens an editable YAML dialog. Import applies the edited content; Close or Escape dismisses the dialog. YAML is not displayed on the main page.

The browser YAML parser and its MIT license are included in `vendor/` for static hosting. Its npm version is recorded in the lockfile; when upgrading js-yaml, update the vendored UMD browser build and license from the installed package as well.

## Core features

1. Cash flow management for income, expenses, and savings
2. Tax calculation and tax scenario planning
3. Lifetime financial simulation for retirement and wealth growth
4. Pension planning including AV depot, Riester, and related retirement products
5. Savings planning and goal-based financial forecasting
6. ETF and investment analysis
7. Single-person and household calculations
8. Scenario comparison for different financial decisions
9. Personal data storage in YAML format
10. Long-term financial projections and simulations

## Feature overview

- Track monthly and annual cash flow
- Estimate taxes and net income
- Model retirement and pension outcomes over time
- Compare saving strategies and investment options
- Evaluate ETF allocations and portfolio growth
- Support private person and household financial planning
- Save user data locally for reuse and comparison
- Run simulations to compare different financial scenarios
- Personal data and Cash flow span the full content width. Expand these initially collapsed sections or Add asset to edit details or create assets; existing assets remain visible.
- Asset & cash flow projection is a standalone, always-expanded panel spanning the full content width.
- Persönliche Daten enthalten den Kinderfreibetrag als Zähler (z. B. 0,5 oder 1,0) und die Kirchenzugehörigkeit. Beide Angaben werden im YAML gespeichert und importiert, beeinflussen aber noch nicht die Steuerschätzung.

## Vermögensmodelle

Alle Vermögenswerte bieten bearbeitbare Notizen zur Besteuerung, zu Freibeträgen und zur Förderung, sowohl beim Anlegen als auch in den Asset-Details. Diese Informationen beeinflussen keine Berechnungen. Gemeinsame Freibeträge sind nicht als eigener Freibetrag je Asset zu verstehen. Die Notizen werden zusammen mit den Assets und Ereignissen im YAML exportiert und importiert.

Der Asset-Typ „Vermögen“ bietet Voreinstellungen für allgemeines Vermögen, AV-Depot, Riester, ETF-Portfolio und Rürup. Die Auswahl ergänzt eine allgemeine Beschreibung zu Förderung und Besteuerung; sie berechnet weder Anspruchsvoraussetzungen noch Steuerersparnisse. Die angenommene Rendite von 4 % ist ein bearbeitbarer Beispielwert, keine Prognose oder Garantie.

Ein optionales Geburtsdatum zeigt das aktuelle Alter an. Bei AV-Depot, Riester und Rürup wird der Anlagehorizont auf die verbleibenden Jahre bis zum Alter 67 gesetzt; der Wert bleibt bearbeitbar. Das ist eine Planungsannahme und keine Aussage über den individuellen Renteneintritt.
