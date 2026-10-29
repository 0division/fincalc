# Proposal: German tax calculations

Status: proposal only. No tax calculation or application behavior is changed.

## 1. Goal and current limitations

Provide transparent, reproducible annual tax estimates for supported German personal-finance scenarios. Clearly distinguish final tax liability, payroll withholding, and actual tax payments.

The current `calculateTaxEstimate` subtracts a hard-coded allowance from salary, applies 14%, and reduces the result by 15% for a couple. It is not a German income-tax calculation. Cash-flow projections currently do not deduct that estimate.

Other limitations:

- Gross salary is not taxable income; deductions and other income need separate treatment.
- Household type does not establish eligibility for joint assessment.
- Tax class, child allowance factor, and church membership are captured, but are not calculation inputs.
- Asset tax/subsidy notes are free text, not executable rules.
- Pension and investment assumptions overlap with the separate portfolio estimate.

The replacement must not imply a complete tax return or guaranteed tax advice.

## 2. Scope and rollout

### Phase 1: Annual income-tax engine

Start with an explicitly entered **taxable income (zu versteuerndes Einkommen)** and a selected, verified tax year:

- Statutory progressive income-tax tariff with prescribed rounding.
- Individual assessment and eligible joint assessment using income splitting.
- Solidarity surcharge with the correct assessment base, exemption and transition rules.
- Church tax for a supported state/community combination and relevant assessment base.
- Itemized explanation, rule version, source references, and unsupported-case warnings.

This mode must not pretend to derive taxable income from gross salary. Do not silently use the existing salary field as taxable income.

### Phase 2: Employment and family model

Add gross-income-to-taxable-income derivation for explicitly supported employment scenarios:

- Separate person records, employment income, relevant deductions, and assessment choice.
- Applicable work-related expenses and pension/insurance deductions, with verified caps and interactions.
- Child eligibility periods, shares, child benefit, and the statutory child-benefit comparison.
- Supported employee social contributions as a separate module if a net-salary estimate is offered.

Payroll withholding is a separate feature, preferably based on the official annual BMF program flow plan. It must not be approximated by changing final annual tax according to tax class.

### Phase 3: Investment taxation

Support explicit taxable investment transactions, shared savings allowances, appropriate loss categories, and verified fund treatment. Unrealized appreciation is not automatically a taxable gain.

### Phase 4: Pension products and support

Implement verified product-specific treatment for Riester, Rürup and other supported retirement products. AV-Depot support requires verification of the actual enacted regime and effective date; a product label must not activate speculative rules.

Property, business income, foreign income, progression clauses, special church-tax cases, and other unsupported regimes should be excluded with visible warnings until separately specified and tested.

## 3. Required data

Keep personal identity, household planning, and tax assessment separate.

| Area | Proposed fields |
|---|---|
| Rules | `taxYear`, `jurisdiction`, `rulesVersion` |
| Assessment | `assessmentMode`, eligible assessed person IDs |
| Person | Stable ID, birth date, tax residence, state, church membership and supported liability periods |
| Income | Income by person and category; gross/taxable/net basis explicitly identified |
| Deductions | Structured category, amount, eligible period and applicable person |
| Children | Birth date, eligibility periods, allocated allowance share and child-benefit entitlement inputs |
| Investments | Ownership shares, tax wrapper, acquisition cost/tax lots, taxable events, loss categories |
| Allowances | Assessment-level shared pools and allocations, rather than one allowance per asset |
| Payments | Withheld taxes, prepayments, refunds and payment dates |

Do not infer state solely from free-text city. Do not infer joint assessment from `householdType: couple`. Church membership alone is not enough to determine all church-tax rules.

The existing Kinderfreibetrag counter may remain as a payroll-oriented input, but must not be interpreted directly as a euro deduction from taxable income. Annual family calculations need explicit eligibility information.

## 4. Rules and authoritative sources

Implement a versioned ruleset for each supported year. Record effective periods, source URL/document, publication/version identifier, verification date, and expected rounding for every rule.

Starting points for implementation research, not a claim that a particular year's parameters have already been verified:

- [Income Tax Act (EStG)](https://www.gesetze-im-internet.de/estg/): tariff, deductions, children, capital income and pension treatment.
- [Solidarity Surcharge Act](https://www.gesetze-im-internet.de/solzg_1995/).
- [Investment Tax Act](https://www.gesetze-im-internet.de/invstg_2018/).
- [Official BMF tax calculator](https://www.bmf-steuerrechner.de/): reference calculations and payroll program documentation.
- Official state tax administrations and applicable church-tax legislation for state/community rules.
- Official pension-support authorities and applicable legislation for product eligibility and subsidies.

Do not copy thresholds from this proposal, assume today's rules apply to future years, or treat a draft reform as enacted law.

For unsupported future years offer two explicit choices: stop the tax projection, or freeze the last supported ruleset as a clearly labeled scenario assumption. Never silently extrapolate statutory thresholds.

## 5. Calculation pipeline

1. Validate inputs and determine the supported ruleset and assessment scope.
2. Derive taxable income only in a supported derivation mode; otherwise require it explicitly.
3. Apply the statutory assessment tariff, including splitting where applicable.
4. Perform supported family/child comparisons and derive the relevant tax assessment bases.
5. Calculate solidarity surcharge and church tax using their own verified bases and interactions.
6. Calculate supported investment taxes and apply shared allowances/loss rules without double counting.
7. Apply supported pension deductions and subsidy comparisons in the correct legal sequence; recompute dependent stages when required.
8. Produce annual liability and a separate reconciliation against withholding/prepayments.

This is a conceptual pipeline, not a legal ordering specification. Child-related assessment bases, church-tax deductibility, capital-income interactions and product-specific comparisons require explicit dependency rules before coding. Do not solve these by repeatedly applying arbitrary percentage discounts.

### Arithmetic

- Use explicit monetary units and statutory rounding at the specified steps.
- Choose decimal or integer arithmetic according to the actual tariff formulas; do not truncate intermediates merely because final outputs are euros.
- Keep calculation functions pure and independent of DOM state, formatting and the current clock.
- Return structured explanations rather than only a total.

Suggested result shape:

```javascript
{
  taxYear: 2026,
  rulesVersion: "de-2026-verified-version",
  status: "supported",
  taxableIncome: 0,
  incomeTax: 0,
  solidaritySurcharge: 0,
  churchTax: 0,
  investmentTax: 0,
  totalLiability: 0,
  paymentsAlreadyMade: 0,
  estimatedSettlement: 0,
  breakdown: [],
  assumptions: [],
  warnings: [],
  sources: []
}
```

Amounts above are placeholders, not reference tax values. `investmentTax` must exclude amounts already included in another tax component. Define whether each component contains surcharges so the total cannot add them twice.

## 6. Asset taxes and support

Replace free-text inference with optional structured tax configuration. Preserve existing notes as notes.

- A deposit is not automatically deductible; a withdrawal is not automatically taxable in full.
- Investment gains require a cost basis and applicable transaction model.
- Household/person allowance pools are consumed once across relevant assets.
- Separate accumulating returns, distributed income, realized gains, fund-specific annual taxation, and tax paid.
- Separate support paid into an asset from tax relief/refunds paid externally.
- Do not add a subsidy both to the asset value and to household spendable income unless the transaction actually has both distinct effects.
- Store eligibility inputs and rules used; product presets only prefill assumptions and do not prove eligibility.

Coordinate the monetary ledger with the [Asset transactions & changes proposal](./003-asset-transactions-and-changes.md). The tax engine consumes taxable facts; it must not mutate asset balances directly.

## 7. Cash-flow and projection integration

Use the same tax result in summary, annual projection, scenario comparison and YAML output.

- Distinguish gross income, net income, social contributions, accrued liability and paid taxes.
- Never subtract calculated tax again from income already marked net.
- Keep final annual liability separate from withholding and settlement. A refund is not a second reduction of the original liability.
- Model payment timing explicitly; annual estimates are not exact monthly cash movements.
- Label projections that omit social insurance as after-tax, not full net salary.
- Show gross asset values and after-tax estimates distinctly. Retirement withdrawal tax requires a payout model, not an arbitrary haircut to accumulated wealth.

Gate the new calculation behind an explicit supported mode until existing data has a known income basis and necessary tax inputs. Do not silently change existing users' cash-flow figures.

## 8. UI and persistence

- Add an expandable full-width **Tax assumptions / Steuerannahmen** section.
- Require a tax year and make supported/unsupported scope visible.
- Offer **Taxable-income input** first; add **Derive from gross income** only when supported.
- Show a breakdown of tax components, deductions, payments, assumptions and sources.
- Display missing inputs and unsupported cases rather than a plausible-looking zero.
- Maintain English/German labels and accessible validation messages.
- Version the YAML schema and round-trip all structured tax inputs and selected ruleset.
- Do not import tax rules/formulas as executable code from user YAML.
- Migrate older files to explicitly unconfigured tax assumptions; never reinterpret old free-text notes as amounts or eligibility.

## 9. YAML change: explicit tax assumptions instead of inferred notes

Today, top-level fields such as `taxClass`, `childAllowance` and `church`, plus asset notes, do not define a complete assessment.

Proposed next-schema fragment:

```yaml
schemaVersion: 2
persons:
  - id: person-main
    name: Example Person
    birthDate: "1990-01-15"
tax:
  enabled: true
  taxYear: 2026
  jurisdiction: DE
  rulesVersion: de-2026-verified-version
  assessmentMode: individual
  personIds:
    - person-main
  inputMode: taxable-income
  taxableIncome: 45000
  churchTax:
    state: BE
    memberships:
      - personId: person-main
        community: none
  payments:
    withholding: 0
    prepayments: 0
  futureYears:
    policy: stop
```

The rules version is an illustrative placeholder, not a verified ruleset. Enable calculation only after that version exists locally and its coverage matches the inputs. Amounts above are example inputs, not computed tax results.

New fields establish the year, assessment scope, input basis and unsupported-future-year policy. Existing household type and salary must not silently fill them. Person IDs link future child, pension and asset-ownership inputs without interpreting free-text notes.

Phase 1 stores only supported explicit taxable-income assumptions. Later gross-income, family and investment modes need separately specified schema extensions; do not activate them through arbitrary fields in YAML. Shared allowance pools belong to the assessment/person scope, not duplicated asset notes. Tax results are derived and recomputed rather than imported as authoritative liabilities.

Actual tax payments eventually link to the [cashflow journal](./004-hierarchical-cashflows-and-assets.md). The annual withholding/prepayment totals shown here are reconciliation inputs, not additional payment rules; the same payments must not be generated a second time.

## 10. Testing and acceptance criteria

### Pure calculation tests

- Official/reference fixtures for each supported year and assessment mode.
- Values immediately below, at and above every tariff and surcharge boundary.
- Prescribed rounding, zero income, negative/invalid inputs, and extreme but supported amounts.
- Individual versus eligible joint assessment with unequal person incomes.
- Children affecting income tax and surcharge/church-tax bases according to verified rules.
- Church liability periods and supported state/community combinations.
- Shared investment allowance exhausted across multiple assets exactly once.
- Loss categories and prohibited offsets; distributions versus unrealized/realized gains.
- Product contribution limits, eligibility and tax-relief/subsidy interactions.

### Integration/component tests

- Changing assumptions updates every relevant view consistently.
- Net-income mode prevents double deduction.
- Tax payments/refunds reconcile without duplicate cash flows.
- Unsupported years and missing inputs produce explicit warnings and no fabricated result.
- YAML round-trips inputs; invalid imports do not partially change state.
- Both languages expose units, assumptions and validation feedback.

Run all tests locally. Reference fixtures must record their official source, rule version and verification date; do not send personal financial data to an external calculator.

## 11. First implementation milestone

Implement only Phase 1 with a single verified year, explicit taxable-income input, supported assessment modes, supported surcharge/church-tax cases, a source-backed breakdown, and boundary/reference tests. Preserve the existing cash-flow behavior until the user opts into the new model.

Completion means verified fixtures match, unsupported cases are explicit, YAML round-trips the new inputs, and no UI presents gross salary as taxable income or an incomplete estimate as a complete tax return.
