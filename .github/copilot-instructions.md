# Project coding instructions

## Architecture and conventions

- This is a framework-free browser app: keep the interface in `index.html`, styling in `styles.css`, and behavior in `app.js`. Avoid introducing a framework or build step for isolated changes.
- Preserve the existing plain JavaScript style and DOM event patterns. Keep calculations and UI behavior understandable and avoid unnecessary abstractions.
- All user-facing text must be available in both English and German through the translation table in `app.js`; label controls accessibly and keep the layout usable on narrow screens.
- This app covers German personal finance. Do not present tax treatment, eligibility, or investment returns as individualized or guaranteed advice. For legal or tax-specific claims, verify current rules from authoritative sources and document assumptions; do not add tax calculations without tests for relevant cases.
- Keep user data import/export compatible when changing the persisted or YAML data shape. Document intentional format changes.
- Every design proposal in `docs/proposals/` must describe its YAML changes with concrete examples, migration implications, and references to related schemas. If no YAML change is needed, state that explicitly. Mark proposed formats as not yet supported.

## Testing

- Run the app with `npm start`; it serves the static page at `http://localhost:8000/`. In VS Code, run the **Run fincalc** task.
- Run `npm test` for the DOM interaction tests and `node --check app.js` after JavaScript changes.
- Add or update tests for user-visible behavior and calculations affected by a change. Prefer tests against the actual page markup and browser interactions over implementation-detail assertions.
- Run `git diff --check` before completing a change. Do not add a framework or test dependency unless existing tools cannot cover the requirement.
- Update `fincalc.de.md` when changing documented product behavior or planning assumptions.
