# Proposal: Asset transactions & changes

Status: proposal only; no application behavior is changed.

## 1. Naming and objective

Use **Asset transactions & changes** in English and **Buchungen & Änderungen** in German. Keep `events` as the technical collection name for compatibility.

An event describes either a movement of money or a dated change to an asset's planning assumptions. These are different concepts and should not share an ambiguous "Amount / rate" input.

In particular:

- **Deposit / Einzahlung** means money paid into an investment.
- **Withdrawal / Entnahme** means money taken out of an investment.
- **Loan drawdown / Kreditauszahlung** means additional borrowing, not a withdrawal from savings.
- **Payment change / Ratenänderung** changes a recurring contribution or repayment in euros.
- **Interest-rate change / Zinsänderung** changes a contractual annual interest rate.
- **Expected-return change / Renditeänderung** changes a projection assumption, not a contractual guarantee.

## 2. Current limitations

The current implementation uses `buy`, `sell`, `contribution`, `rate-change`, `maintenance`, `income`, and `expense`, with a year and one overloaded `amount` field.

- `rate-change` does not distinguish an interest rate from a recurring payment or expected return.
- Adding a past/current-year event mutates the current asset value, while future events are applied during projection. Editing or replaying history would risk double counting.
- Asset value and cash flow are computed separately and can disagree. For example, an expense need not reduce an investment's balance, and income need not be reinvested.
- Year-only timing cannot express a contribution change halfway through a year or a monthly withdrawal plan.
- Household projections do not currently reconcile all asset-level cash flows.
- YAML export includes events, but the current importer only restores top-level fields, not assets or nested events.

## 3. Event catalogue

Amounts are positive EUR values; the event type determines direction. Rate fields use percentage points per year: `3.5` means 3.5%, not 0.035.

| Technical type | English / German | Balance effect | Household cash effect |
|---|---|---|---|
| `deposit` | Deposit / Einzahlung | Increase investment balance | Outflow if paid externally |
| `withdrawal` | Withdrawal / Entnahme | Decrease investment balance | Inflow if paid externally |
| `transfer` | Transfer / Umbuchung | Decrease source, increase destination | None within the household |
| `loan-drawdown` | Loan drawdown / Kreditauszahlung | Increase outstanding debt | Inflow |
| `loan-repayment` | Repayment / Tilgung | Decrease debt principal | Outflow |
| `income` | Income / Ertrag | Increase balance only if retained | Inflow only if paid out |
| `fee` | Fee / Gebühr | Reduce balance only if charged to asset | Outflow only if paid externally |
| `expense` | Expense / Ausgabe | Normally no balance change | Outflow |
| `contribution-change` | Contribution change / Sparratenänderung | Set future monthly deposits | Changes future outflows |
| `repayment-change` | Repayment change / Tilgungsratenänderung | Set future monthly principal repayments | Changes future outflows |
| `withdrawal-plan-change` | Withdrawal-plan change / Entnahmeplanänderung | Set future monthly withdrawals | Changes future inflows |
| `interest-rate-change` | Interest-rate change / Zinsänderung | Set contractual interest assumption | Depends on interest settlement |
| `return-rate-change` | Expected-return change / Renditeänderung | Set projected annual return | None directly |
| `valuation` | Valuation / Bewertung | Replace balance with an observed value | None |
| `support-payment` | Subsidy payment / Förderzahlung | Increase balance if credited to asset | Inflow only if paid externally |
| `tax-payment` | Tax payment / Steuerzahlung | Reduce balance only if charged to asset | Outflow only if paid externally |
| `tax-refund` | Tax refund / Steuererstattung | Increase balance only if reinvested | Inflow only if paid externally |

Acquisition and disposal of a property, business, or security can use dedicated UI labels over deposit/withdrawal semantics where appropriate. Fees and taxes must remain separate, not hidden inside a purchase amount.

The repayment model above is explicitly principal-only. An annuity payment that includes both interest and principal needs a separate amortization schedule; do not silently interpret the same monthly amount both ways.

## 4. Data shape

Use a discriminated event schema: each type accepts only its relevant fields. Common fields:

- `id`: stable unique identifier.
- `type`: one of the defined event types.
- `effectiveDate`: ISO calendar date, `YYYY-MM-DD`.
- `sequence`: explicit order for events on the same date.
- `description`: optional user note.
- `amount`: EUR amount for a monetary transaction.
- `annualRatePercent`: absolute replacement rate for an interest/return change.
- `monthlyAmount`: absolute replacement amount for a recurring-plan change; zero stops the plan.
- `settlement`: `asset` or `external` for income, fees, support, and taxes.
- `destinationAssetId`: required for an internal transfer.

Treat these as type-specific fields, not as optional inputs shown for every event. Validate types and reject unexpected or incompatible fields.

Example:

```yaml
events:
  - id: event-deposit
    type: deposit
    effectiveDate: "2027-01-15"
    sequence: 0
    amount: 2000
    description: "Additional investment"
  - id: event-plan
    type: contribution-change
    effectiveDate: "2027-07-01"
    sequence: 0
    monthlyAmount: 400
  - id: event-return
    type: return-rate-change
    effectiveDate: "2028-01-01"
    sequence: 0
    annualRatePercent: 5
  - id: event-withdrawal
    type: withdrawal
    effectiveDate: "2035-06-01"
    sequence: 0
    amount: 10000
```

Recurring plans remain in effect until replaced or stopped. Keep one-off transactions separate from plan changes; do not encode recurrence inside a generic deposit event.

## 5. Projection and accounting rules

1. Give each asset a balance snapshot and an `asOfDate`. The snapshot includes all activity through that date. Earlier events remain visible as history but must not be replayed into the projection.
2. Adding historical records must not silently mutate that snapshot. Updating the snapshot is an explicit action.
3. Use one deterministic monthly simulation for balances and cash-flow ledgers. Annual tables aggregate its results rather than independently recalculating events.
4. For the first version, group dated future events by calendar month. Apply them at the start of their effective month, sorted by date then sequence. Disclose that dates do not imply daily interest precision. Project only complete months after the snapshot month.
5. Apply all explicit events first, accrue growth/interest second, and settle recurring plans at month end. Changes therefore affect the effective month's accrual and recurring payment.
6. Interpret expected investment returns as effective annual returns: monthly rate is `(1 + annualRatePercent / 100) ** (1 / 12) - 1`. Contractual loan interest requires an explicitly documented nominal/effective convention.
7. Record household flows once. Transfers are paired entries, and must not become household income/expense. Retained income increases asset value without creating spendable household income.
8. A withdrawal cannot exceed available funds unless overdraft is explicitly supported. Report the shortfall; never clamp it silently. Repayments are capped at outstanding principal, with the unused amount explicitly shown.
9. Fixed event amounts are nominal EUR and do not automatically grow with inflation. Inflation-adjusted display is a separate transformation. Any indexed recurring plan must be explicitly configured.
10. Editing/deleting an event replays the simulation from the unchanged snapshot, producing the same result as a fresh calculation.

When birth date is available, show age alongside dates. A future option can schedule a retirement-phase change by target age, with its derived calendar date visible. Do not equate age 67 with every person's legal retirement date.

## 6. UI

- Replace the generic event editor with two groups: **Money movements / Buchungen** and **Plan changes / Planänderungen**.
- Offer only compatible types: loan events for loans, expected-return changes for investments, contractual interest changes for interest-bearing products.
- Show contextual inputs and units: `Amount (EUR)`, `Monthly payment (EUR)`, or `Annual interest (%)`.
- Display the affected balance and household cash flow in a preview before saving.
- Timeline rows show date, type, amount/new setting, settlement, note, and edit/delete actions.
- Clearly mark historical records versus projected transactions.
- Support all labels, validation errors, and previews in English and German.

## 7. Wealth-product presets and tax treatment

The generic **Vermögen** asset remains fully configurable. AV-Depot, Riester, ETF-Portfolio, and Rürup supply editable product defaults and contextual descriptions.

- Keep contribution rules, subsidies, deductions, tax deferral, and payout taxation separate.
- Manually entered support and tax transactions are explicit assumptions, not evidence of eligibility.
- Product-specific withdrawal restrictions require verified, dated rules and an explicit model; a generic withdrawal event does not imply the contract permits it.
- Do not automatically create subsidies or tax refunds until eligibility, caps, interactions, and payout taxation are modeled and tested.

## 8. Compatibility and rollout

Introduce a YAML schema version before changing event semantics. Preserve legacy files and surface ambiguous migration choices rather than guessing:

- `contribution` can map to a one-off deposit for an investment.
- `rate-change` maps to contractual interest for a loan only when its rate convention is known; otherwise request confirmation.
- `buy`/`sell` need asset-specific acquisition/disposal mapping.
- `income`, `maintenance`, and `expense` need a settlement choice because the old implementation does not distinguish external payment from balance movement.
- A year alone cannot establish precise timing. Offer a visible January 1 assumption, requiring confirmation.

Implement complete nested YAML import/export and round-trip tests before claiming persistence for the new model.

Suggested implementation order:

1. Typed schema, validation, explicit snapshot semantics, and migration.
2. Shared projection/cash-flow engine for deposits, withdrawals, and plan/rate changes.
3. Contextual editor, previews, editing/deletion, and bilingual feedback.
4. Transfers, explicit interest settlement/amortization, and manually entered fees/support/taxes.
5. Separately scoped, verified product-specific tax and subsidy calculations.

## 9. YAML change: snapshots, IDs and explicit event fields

The earlier event example describes the proposed event payload. The surrounding asset also changes: stable IDs and an explicit balance snapshot replace the ambiguous combination of current value and historical replay. This is an illustrative fragment of the next schema, not a currently importable file:

```yaml
schemaVersion: 2
assets:
  - id: savings
    type: wealth
    name: Savings
    snapshot:
      asOfDate: "2026-12-31"
      value: 10000
    events:
      - id: withdrawal-1
        type: withdrawal
        effectiveDate: "2027-06-01"
        sequence: 0
        amount: 500
      - id: return-change-1
        type: return-rate-change
        componentId: savings-growth
        effectiveDate: "2028-01-01"
        sequence: 0
        annualRatePercent: 3
    components:
      - id: savings-growth
        type: price-growth
        category: value-change
        effectiveFrom: "2027-01-01"
        calculation:
          type: effective-annual-rate
          annualRatePercent: 2
          basis: opening-month-value
        settlement: valuation
```

Compared with today's YAML, `year` becomes `effectiveDate`; overloaded `amount` is replaced by type-specific fields, and rate changes target a stable `componentId`. The snapshot defines what is already included in the opening value.

The [component proposal](./005-asset-performance-income-and-costs.md) refines rate changes to reference individual components. The [hierarchical cashflow proposal](./004-hierarchical-cashflows-and-assets.md) adds explicit accounts and categories for settlement. The withdrawal fragment intentionally omits its eventual destination account; a complete linked-ledger configuration must supply it before execution. These examples must converge on one schema before implementation.

## 10. Acceptance tests

- Deposit/withdrawal affects both the correct asset and household cash ledger once.
- A July contribution change applies to July through December only.
- An interest/return change affects only subsequent modeled accrual; a payment change never changes the interest rate.
- Retained income versus paid-out income produces different balance/cash results without double counting.
- Transfers preserve household net worth and create no external cash flow.
- History at/before the snapshot is not replayed; editing an event gives the same result as a fresh simulation.
- Same-date ordering is stable and explicit; editing/deleting events is deterministic.
- Excess withdrawals produce visible shortfalls; loan principal never becomes negative.
- Fixed nominal transactions are not inflation-escalated.
- YAML round-trips the snapshot, every supported event field, stable IDs, and ordering.
- UI tests cover contextual fields, invalid inputs, date/age display, previews, and both languages.
