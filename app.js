const defaultAssets = [
  {
    id: "asset-house",
    type: "house",
    name: "Home",
    value: 320000,
    interestRate: 3.2,
    monthlyContribution: 0,
    acquisitionYear: 2021,
    events: [
      { id: "evt-house-1", type: "buy", year: 2021, amount: 320000, description: "Purchase of home" },
      { id: "evt-house-2", type: "rate-change", year: 2024, amount: 3.2, description: "Mortgage interest adjustment" },
    ],
  },
  {
    id: "asset-etf",
    type: "etf",
    name: "ETF portfolio",
    value: 40000,
    interestRate: 7.5,
    monthlyContribution: 350,
    acquisitionYear: 2022,
    events: [
      { id: "evt-etf-1", type: "buy", year: 2022, amount: 25000, description: "Initial ETF purchase" },
      { id: "evt-etf-2", type: "contribution", year: 2024, amount: 4200, description: "Annual contribution" },
    ],
  },
  {
    id: "asset-loan",
    type: "loan",
    name: "Student loan",
    value: 18000,
    interestRate: 2.1,
    monthlyContribution: 250,
    acquisitionYear: 2020,
    events: [
      { id: "evt-loan-1", type: "buy", year: 2020, amount: 18000, description: "Loan taken out" },
      { id: "evt-loan-2", type: "rate-change", year: 2025, amount: 2.1, description: "Interest rate review" },
    ],
  },
];

const state = {
  name: "Max Mustermann",
  city: "Berlin",
  birthDate: "1990-01-15",
  taxClass: "2",
  childAllowance: 0,
  church: "none",
  householdType: "single",
  salary: 72000,
  sideIncome: 250,
  rent: 1200,
  food: 500,
  insurance: 350,
  transport: 220,
  leisure: 300,
  investment: 600,
  currentSavings: 25000,
  annualReturn: 6,
  years: 20,
  inflationRate: 2,
  pensionContribution: 200,
  assets: defaultAssets,
};

const idMap = {
  name: "name",
  city: "city",
  birthDate: "birthDate",
  taxClass: "taxClass",
  childAllowance: "childAllowance",
  church: "church",
  householdType: "householdType",
  salary: "salary",
  sideIncome: "sideIncome",
  rent: "rent",
  food: "food",
  insurance: "insurance",
  transport: "transport",
  leisure: "leisure",
  investment: "investment",
  currentSavings: "currentSavings",
  annualReturn: "annualReturn",
  years: "years",
  inflationRate: "inflationRate",
  pensionContribution: "pensionContribution",
};

const numericFields = Object.keys(idMap).filter((key) => !["name", "city", "birthDate", "taxClass", "church", "householdType"].includes(key));

const retirementAge = 67;
const wealthProducts = {
  general: { nameKey: "wealthGeneral", treatmentKey: "wealthTreatmentGeneral", retirement: false },
  "av-depot": { nameKey: "wealthAvDepot", treatmentKey: "wealthTreatmentAvDepot", retirement: true },
  riester: { nameKey: "wealthRiester", treatmentKey: "wealthTreatmentRiester", retirement: true },
  "etf-portfolio": { nameKey: "wealthEtfPortfolio", treatmentKey: "wealthTreatmentEtf", retirement: false },
  ruerup: { nameKey: "wealthRuerup", treatmentKey: "wealthTreatmentRuerup", retirement: true },
};

const translations = {
  en: {
    load: "Load",
    save: "Save",
    shareYaml: "Share YAML",
    showYaml: "Show",
    close: "Close",
    yamlLoaded: "YAML loaded.",
    yamlSaved: "YAML download started.",
    yamlCopied: "YAML copied to clipboard.",
    clipboardUnavailable: "Clipboard access requires a supported browser and a secure connection (HTTPS or localhost).",
    yamlFailure: "Could not complete the YAML action: ",
    eyebrow: "German personal finance",
    domain: "Domain",
    language: "Language",
    loadDemo: "Load demo data",
    personalData: "Personal data",
    assetTaxNotes: "Tax treatment",
    assetAllowanceNotes: "Allowance notes",
    assetSubsidyNotes: "Subsidy notes",
    assetTaxNotesHelp: "Information only, not calculated. Shared allowances must not be counted separately for each asset.",
    name: "Name",
    city: "City",
    birthDate: "Date of birth",
    ageUnknown: "Enter your date of birth to calculate your age.",
    ageDisplay: "Current age: {age}",
    taxClass: "Tax class",
    childAllowance: "Child allowance factor",
    church: "Church membership",
    churchNone: "None",
    churchCatholic: "Roman Catholic",
    churchProtestant: "Protestant",
    churchOther: "Other religious community",
    taxProfileNote: "Child allowance and church membership are saved only; they do not affect the tax estimate.",
    householdType: "Household type",
    single: "Single",
    couple: "Couple",
    cashFlow: "Cash flow",
    grossSalary: "Gross salary (year)",
    sideIncome: "Side income (month)",
    rentMortgage: "Rent / mortgage (month)",
    foodDaily: "Food & daily life (month)",
    insuranceHealth: "Insurance & health (month)",
    transportMobility: "Transport & mobility (month)",
    leisureOther: "Leisure & other costs (month)",
    monthlyInvestment: "Monthly investment contribution",
    retirementWealth: "Retirement & wealth",
    currentSavings: "Current savings",
    expectedReturn: "Expected annual return (%)",
    horizon: "Investment horizon (years)",
    inflation: "Expected inflation (% / year)",
    pensionContribution: "Pension contribution (month)",
    wealthProduct: "Wealth product",
    wealthTaxTreatment: "Support and tax treatment",
    wealthNoTaxCalculation: "These are general planning classifications only; eligibility and tax savings are not calculated.",
    wealthGeneral: "General wealth",
    wealthAvDepot: "AV-Depot",
    wealthRiester: "Riester",
    wealthEtfPortfolio: "ETF-Portfolio",
    wealthRuerup: "Rürup",
    typeWealth: "Wealth",
    wealthReturnNote: "Illustrative default return: 4% per year. This is an editable assumption, not a forecast or guarantee.",
    wealthTreatmentGeneral: "No product-specific subsidy is assumed. Tax treatment depends on the underlying asset and applicable rules.",
    wealthTreatmentAvDepot: "Potential support or tax-deferral features depend on the product and applicable rules; they are not calculated here.",
    wealthTreatmentRiester: "Allowances and/or tax deductions may apply subject to eligibility and applicable rules; retirement benefits are taxed.",
    wealthTreatmentEtf: "No dedicated state subsidy is assumed. Investment income and disposals may be taxable under applicable rules.",
    wealthTreatmentRuerup: "Eligible contributions may receive tax relief subject to applicable rules; retirement payouts are taxed.",
    wealthHorizonNote: "Planning horizon set to the years remaining until age 67; you can edit it in Retirement & wealth.",
    assets: "Assets",
    assetType: "Asset type",
    typeHouse: "House",
    typeStock: "Stock",
    typePension: "Pension",
    typeLoan: "Loan",
    typeCash: "Cash",
    typeBusiness: "Business",
    typeIncome: "Income",
    currentValue: "Current value",
    annualRate: "Annual return (%)",
    monthlyContribution: "Monthly contribution",
    monthlyIncome: "Monthly income",
    acquisitionYear: "Acquisition year",
    addAsset: "Add asset",
    projectionTitle: "Asset & cash flow projection",
    projectionNote: "Compare annual income, costs, investments, and each asset side by side. Future cash flows are assumed to grow with inflation; “Today's €” shows purchasing power in today's euros.",
    showValues: "Show values",
    valueBasis: "Display values as",
    nominalOption: "Nominal values",
    todayOption: "Today's value",
    bothOption: "Nominal + real",
    cashFlowDetails: "Cash flow details (net only)",
    cashFlowDetailsOpen: "Cash flow details (income, expenses, investments & net)",
    cashFlowDetailsHelp: "Expand to include income, expenses, and investments in the projection table.",
    everyYear: "Every year",
    everyTenYears: "Every 10 years",
    summary: "Summary",
    monthlyNetFlow: "Monthly net cash flow",
    annualTax: "Annual tax estimate",
    annualSavings: "Annual savings capacity",
    retirementPortfolio: "Portfolio at retirement",
    yamlExport: "YAML export",
    exportYaml: "Export YAML",
    importYaml: "Import YAML",
    income: "Income",
    expenses: "Expenses",
    investments: "Investments",
    netCashFlow: "Net cash flow",
    liability: "liability",
    nominal: "Nominal",
    todaysEuro: "Today's €",
    year: "Year",
    cashFlowGroup: "Cash flow",
    assetGroup: "Assets",
    noAssets: "No assets yet. Add your first asset to start planning.",
    addAssetsForProjection: "Add assets to see their projected values.",
    assetDetails: "Asset details",
    value: "Value",
    valueOwed: "Value owed",
    annualInterestRate: "Annual rate",
    monthlyRepayment: "Monthly repayment",
    acquired: "Acquired",
    eventType: "Event type",
    eventYear: "Year",
    amount: "Amount",
    amountRate: "Amount / rate (%)",
    description: "Description",
    optionalNote: "Optional note",
    addEvent: "Add event",
    remove: "Remove",
    eventTimeline: "Event timeline",
    noEvents: "No events recorded for this asset yet.",
    noDescription: "No description",
    initialSetup: "Initial asset setup",
    newAsset: "New asset",
    initialPurchase: "Initial {type} purchase",
    buy: "Buy",
    sell: "Sell",
    contribution: "Contribution",
    rateChange: "Rate change",
    maintenance: "Maintenance",
    expense: "Expense",
    assetView: "Asset display",
    cardView: "Cards",
    listView: "Compact list",
    assetCashFlow: "Asset cash flow",
    annualIncome: "Annual income",
    annualExpenses: "Annual expenses",
    annualNetCashFlow: "Annual net cash flow",
    initialHomePurchase: "Purchase of home",
    mortgageRateReview: "Mortgage interest adjustment",
    etfInitialPurchase: "Initial ETF purchase",
    annualContribution: "Annual contribution",
    loanTakenOut: "Loan taken out",
    loanRateReview: "Interest rate review",
  },
  de: {
    load: "Laden",
    save: "Speichern",
    shareYaml: "YAML teilen",
    showYaml: "Anzeigen",
    close: "Schließen",
    yamlLoaded: "YAML geladen.",
    yamlSaved: "YAML-Download gestartet.",
    yamlCopied: "YAML in die Zwischenablage kopiert.",
    clipboardUnavailable: "Die Zwischenablage benötigt einen unterstützten Browser und eine sichere Verbindung (HTTPS oder localhost).",
    yamlFailure: "YAML-Aktion fehlgeschlagen: ",
    eyebrow: "Private Finanzen in Deutschland",
    domain: "Domain",
    language: "Sprache",
    loadDemo: "Beispieldaten laden",
    personalData: "Persönliche Daten",
    assetTaxNotes: "Besteuerung",
    assetAllowanceNotes: "Freibeträge (Notizen)",
    assetSubsidyNotes: "Förderung (Notizen)",
    assetTaxNotesHelp: "Nur Informationen, keine Berechnung. Gemeinsame Freibeträge dürfen nicht je Vermögenswert erneut gezählt werden.",
    name: "Name",
    city: "Stadt",
    birthDate: "Geburtsdatum",
    ageUnknown: "Gib dein Geburtsdatum ein, um dein Alter zu berechnen.",
    ageDisplay: "Aktuelles Alter: {age}",
    taxClass: "Steuerklasse",
    childAllowance: "Kinderfreibetrag (Zähler)",
    church: "Kirchenzugehörigkeit",
    churchNone: "Keine",
    churchCatholic: "Römisch-katholisch",
    churchProtestant: "Evangelisch",
    churchOther: "Andere Religionsgemeinschaft",
    taxProfileNote: "Kinderfreibetrag und Kirchenzugehörigkeit werden nur gespeichert; sie beeinflussen die Steuerschätzung nicht.",
    householdType: "Haushaltstyp",
    single: "Alleinstehend",
    couple: "Paar",
    cashFlow: "Cashflow",
    grossSalary: "Bruttogehalt (Jahr)",
    sideIncome: "Nebeneinkommen (Monat)",
    rentMortgage: "Miete / Kreditrate (Monat)",
    foodDaily: "Lebensmittel & Alltag (Monat)",
    insuranceHealth: "Versicherung & Gesundheit (Monat)",
    transportMobility: "Transport & Mobilität (Monat)",
    leisureOther: "Freizeit & sonstige Kosten (Monat)",
    monthlyInvestment: "Monatlicher Anlagebetrag",
    retirementWealth: "Ruhestand & Vermögen",
    currentSavings: "Aktuelles Sparguthaben",
    expectedReturn: "Erwartete Rendite pro Jahr (%)",
    horizon: "Anlagezeitraum (Jahre)",
    inflation: "Erwartete Inflation (% / Jahr)",
    pensionContribution: "Renteneinzahlung (Monat)",
    wealthProduct: "Vermögensmodell",
    wealthTaxTreatment: "Förderung und Besteuerung",
    wealthNoTaxCalculation: "Dies sind allgemeine Planungshinweise; Berechtigung und Steuerersparnis werden nicht berechnet.",
    wealthGeneral: "Allgemeines Vermögen",
    wealthAvDepot: "AV-Depot",
    wealthRiester: "Riester",
    wealthEtfPortfolio: "ETF-Portfolio",
    wealthRuerup: "Rürup",
    typeWealth: "Vermögen",
    wealthReturnNote: "Illustrative Standardrendite: 4 % pro Jahr. Dies ist eine bearbeitbare Annahme, keine Prognose oder Garantie.",
    wealthTreatmentGeneral: "Es wird keine produktspezifische Förderung angenommen. Die Besteuerung hängt vom zugrunde liegenden Vermögenswert und den geltenden Regeln ab.",
    wealthTreatmentAvDepot: "Mögliche Förderung oder Steuerstundung hängt vom Produkt und den geltenden Regeln ab; sie wird hier nicht berechnet.",
    wealthTreatmentRiester: "Zulagen und/oder steuerliche Abzüge können abhängig von Berechtigung und geltenden Regeln gelten; Leistungen im Alter werden besteuert.",
    wealthTreatmentEtf: "Es wird keine besondere staatliche Förderung angenommen. Kapitalerträge und Veräußerungen können nach den geltenden Regeln steuerpflichtig sein.",
    wealthTreatmentRuerup: "Berechtigte Beiträge können nach den geltenden Regeln steuerlich begünstigt sein; Auszahlungen im Alter werden besteuert.",
    wealthHorizonNote: "Der Planungshorizont wurde auf die verbleibenden Jahre bis zum Alter 67 gesetzt. Du kannst ihn unter „Ruhestand & Vermögen“ ändern.",
    assets: "Vermögenswerte",
    assetType: "Vermögensart",
    typeHouse: "Immobilie",
    typeStock: "Aktie",
    typePension: "Rente",
    typeLoan: "Kredit",
    typeCash: "Bargeld",
    typeBusiness: "Unternehmen",
    typeIncome: "Einkommen",
    currentValue: "Aktueller Wert",
    annualRate: "Rendite pro Jahr (%)",
    monthlyContribution: "Monatlicher Beitrag",
    monthlyIncome: "Monatliches Einkommen",
    acquisitionYear: "Anschaffungsjahr",
    addAsset: "Vermögenswert hinzufügen",
    projectionTitle: "Vermögens- & Cashflow-Prognose",
    projectionNote: "Jährliches Einkommen, Ausgaben, Anlagen und Vermögenswerte im Vergleich. Künftige Cashflows steigen entsprechend der Inflation; „Heutige €“ zeigt die Kaufkraft in heutigen Euro.",
    showValues: "Werte anzeigen",
    valueBasis: "Werte anzeigen als",
    nominalOption: "Nominalwerte",
    todayOption: "Heutiger Wert",
    bothOption: "Nominal + real",
    cashFlowDetails: "Cashflow-Details (nur netto)",
    cashFlowDetailsOpen: "Cashflow-Details (Einnahmen, Ausgaben, Anlagen & netto)",
    cashFlowDetailsHelp: "Aufklappen, um Einnahmen, Ausgaben und Anlagen in der Prognosetabelle zu sehen.",
    everyYear: "Jedes Jahr",
    everyTenYears: "Alle 10 Jahre",
    summary: "Übersicht",
    monthlyNetFlow: "Monatlicher Netto-Cashflow",
    annualTax: "Geschätzte Jahressteuer",
    annualSavings: "Jährliches Sparpotenzial",
    retirementPortfolio: "Vermögen zum Renteneintritt",
    yamlExport: "YAML-Export",
    exportYaml: "YAML exportieren",
    importYaml: "YAML importieren",
    income: "Einnahmen",
    expenses: "Ausgaben",
    investments: "Anlagen",
    netCashFlow: "Netto-Cashflow",
    liability: "Verbindlichkeit",
    nominal: "Nominal",
    todaysEuro: "Heutige €",
    year: "Jahr",
    cashFlowGroup: "Cashflow",
    assetGroup: "Vermögen",
    noAssets: "Noch keine Vermögenswerte. Füge den ersten Wert hinzu, um mit der Planung zu beginnen.",
    addAssetsForProjection: "Füge Vermögenswerte hinzu, um ihre Prognose anzuzeigen.",
    assetDetails: "Details zum Vermögenswert",
    value: "Wert",
    valueOwed: "Offener Betrag",
    annualInterestRate: "Zinssatz pro Jahr",
    monthlyRepayment: "Monatliche Tilgung",
    acquired: "Anschaffungsjahr",
    eventType: "Ereignistyp",
    eventYear: "Jahr",
    amount: "Betrag",
    amountRate: "Betrag / Zinssatz (%)",
    description: "Beschreibung",
    optionalNote: "Optionale Notiz",
    addEvent: "Ereignis hinzufügen",
    remove: "Entfernen",
    eventTimeline: "Ereignisverlauf",
    noEvents: "Für diesen Vermögenswert sind noch keine Ereignisse erfasst.",
    noDescription: "Keine Beschreibung",
    initialSetup: "Ersteinrichtung des Vermögenswerts",
    newAsset: "Neuer Vermögenswert",
    initialPurchase: "Ersterwerb: {type}",
    buy: "Kauf",
    sell: "Verkauf",
    contribution: "Einzahlung",
    rateChange: "Zinsänderung",
    maintenance: "Instandhaltung",
    expense: "Ausgabe",
    assetView: "Ansicht der Vermögenswerte",
    cardView: "Kacheln",
    listView: "Kompakte Liste",
    assetCashFlow: "Cashflow des Vermögenswerts",
    annualIncome: "Jährliche Einnahmen",
    annualExpenses: "Jährliche Ausgaben",
    annualNetCashFlow: "Jährlicher Netto-Cashflow",
    initialHomePurchase: "Kauf der Immobilie",
    mortgageRateReview: "Anpassung des Hypothekenzinssatzes",
    etfInitialPurchase: "Erster ETF-Kauf",
    annualContribution: "Jährlicher Beitrag",
    loanTakenOut: "Kredit aufgenommen",
    loanRateReview: "Überprüfung des Zinssatzes",
  },
};

let currentLanguage = localStorage.getItem("fincalc-language") === "de" ? "de" : "en";
let cashFlowBreakdownOpen = false;

function t(key) {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

function getCurrentAge(birthDate) {
  if (!birthDate) return null;
  const [year, month, day] = birthDate.split("-").map(Number);
  const birth = new Date(Date.UTC(year, month - 1, day));
  if (
    !Number.isFinite(birth.getTime()) ||
    birth.getUTCFullYear() !== year ||
    birth.getUTCMonth() !== month - 1 ||
    birth.getUTCDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

function updateAgeDisplay() {
  const age = getCurrentAge(document.getElementById("birthDate").value);
  document.getElementById("ageDisplay").textContent = age === null
    ? t("ageUnknown")
    : t("ageDisplay").replace("{age}", String(age));
}

function setRetirementHorizon() {
  const age = getCurrentAge(document.getElementById("birthDate").value);
  if (age === null) return false;
  document.getElementById("years").value = String(Math.max(1, retirementAge - age));
  return true;
}

function updateWealthProductUI() {
  const isWealth = document.getElementById("assetType").value === "wealth";
  const control = document.getElementById("wealthProductControl");
  const note = document.getElementById("wealthProductNote");
  control.hidden = !isWealth;
  note.hidden = !isWealth;
  if (!isWealth) return;

  const product = wealthProducts[document.getElementById("wealthProduct").value];
  if (!product) return;
  const notes = [t("wealthNoTaxCalculation"), t(product.treatmentKey), t("wealthReturnNote")];
  if (product.retirement && getCurrentAge(document.getElementById("birthDate").value) !== null) {
    notes.push(t("wealthHorizonNote"));
  }
  note.textContent = notes.join(" ");
}

function applyWealthProductPreset(resetBase = false) {
  const subtype = document.getElementById("wealthProduct").value;
  const product = wealthProducts[subtype];
  if (!product) return;

  const nameInput = document.getElementById("assetName");
  const defaultNames = Object.values(wealthProducts).flatMap(({ nameKey }) => [
    translations.en[nameKey],
    translations.de[nameKey],
  ]);
  if (resetBase || nameInput.value === "Rental property" || defaultNames.includes(nameInput.value)) {
    nameInput.value = t(product.nameKey);
  }
  document.getElementById("assetRate").value = "4";
  if (resetBase) {
    document.getElementById("assetValue").value = "10000";
    document.getElementById("assetContribution").value = "0";
    document.getElementById("assetYear").value = String(new Date().getFullYear());
  }
  if (product.retirement) setRetirementHorizon();
  updateWealthProductUI();
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.getElementById("languageSwitch").value = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.getElementById("languageSwitch").setAttribute("aria-label", t("language"));
  document.getElementById("domainSwitch").setAttribute("aria-label", t("domain"));
  document.getElementById("wealthProduct").setAttribute("aria-label", t("wealthProduct"));
  updateAgeDisplay();
  updateWealthProductUI();
  updateCashFlowBreakdownLabel();
  updateAssetContributionLabel();
  renderAssets();
}

function updateCashFlowBreakdownLabel() {
  const details = document.getElementById("cashFlowBreakdown");
  if (!details) return;
  details.querySelector("summary").textContent = t(details.open ? "cashFlowDetailsOpen" : "cashFlowDetails");
}

function updateAssetContributionLabel() {
  const label = document.getElementById("assetContributionLabel");
  if (label) {
    label.textContent = t(document.getElementById("assetType").value === "income" ? "monthlyIncome" : "monthlyContribution");
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat(currentLanguage === "de" ? "de-DE" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function escapeHtml(value) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(value ?? "").replace(/[&<>"']/g, (character) => entities[character]);
}

function parseCurrencyInput(value) {
  const cleaned = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(cleaned) ? cleaned : 0;
}

function getEventLabel(type) {
  const keys = {
    buy: "buy",
    sell: "sell",
    contribution: "contribution",
    "rate-change": "rateChange",
    maintenance: "maintenance",
    expense: "expense",
    income: "income",
  };

  return keys[type] ? t(keys[type]) : type;
}

function getAssetTypeLabel(type, subtype) {
  if (type === "wealth") {
    const product = wealthProducts[subtype] || wealthProducts.general;
    return `${t("typeWealth")} · ${t(product.nameKey)}`;
  }
  const keys = {
    house: "typeHouse",
    stock: "typeStock",
    pension: "typePension",
    loan: "typeLoan",
    cash: "typeCash",
    business: "typeBusiness",
    income: "typeIncome",
  };
  return keys[type] ? t(keys[type]) : type.toUpperCase();
}

function getAssetName(asset) {
  const defaults = {
    "asset-house": "Home",
    "asset-etf": "ETF portfolio",
    "asset-loan": "Student loan",
  };
  const names = {
    en: { "asset-house": "Home", "asset-etf": "ETF portfolio", "asset-loan": "Student loan" },
    de: { "asset-house": "Eigenheim", "asset-etf": "ETF-Portfolio", "asset-loan": "Studienkredit" },
  };
  return defaults[asset.id] ? names[currentLanguage][asset.id] : asset.name;
}

function getEventDescription(event) {
  const descriptions = {
    "Purchase of home": "initialHomePurchase",
    "Mortgage interest adjustment": "mortgageRateReview",
    "Initial ETF purchase": "etfInitialPurchase",
    "Annual contribution": "annualContribution",
    "Loan taken out": "loanTakenOut",
    "Interest rate review": "loanRateReview",
  };
  return descriptions[event.description] ? t(descriptions[event.description]) : event.description || t("noDescription");
}

function readForm() {
  const nextState = { ...state, assets: [...state.assets] };

  for (const [key, fieldId] of Object.entries(idMap)) {
    const element = document.getElementById(fieldId);
    if (!element) continue;

    if (numericFields.includes(key)) {
      nextState[key] = parseCurrencyInput(element.value);
    } else {
      nextState[key] = element.value;
    }
  }

  Object.assign(state, nextState);
  return state;
}

function calculateCashFlow(data) {
  const monthlyIncome = data.salary / 12 + data.sideIncome;
  const monthlyCosts = data.rent + data.food + data.insurance + data.transport + data.leisure;
  const monthlyInvestments = data.investment + data.pensionContribution;
  const monthlyNet = monthlyIncome - monthlyCosts - monthlyInvestments;
  const annualSavings = monthlyNet * 12;

  return {
    monthlyIncome,
    monthlyCosts,
    monthlyInvestments,
    monthlyNet,
    annualSavings,
  };
}

function calculateTaxEstimate(data) {
  const yearIncome = Number(data.salary) || 0;
  const basicDeduction = 10908;
  const taxable = Math.max(0, yearIncome - basicDeduction);
  const annualTax = taxable * 0.14;

  if (data.householdType === "couple") {
    return annualTax * 0.85;
  }

  return annualTax;
}

function calculatePortfolio(data) {
  const currentAssets = Array.isArray(data.assets)
    ? data.assets.reduce((sum, asset) => {
        const value = Number(asset.value) || 0;
        return sum + (asset.type === "loan" ? -value : value);
      }, 0)
    : 0;

  const monthlyRate = (data.annualReturn / 100) / 12;
  const months = data.years * 12;
  const monthlyContribution = data.investment + data.pensionContribution;

  if (monthlyRate === 0) {
    return data.currentSavings + currentAssets + monthlyContribution * months;
  }

  const growthFactor = Math.pow(1 + monthlyRate, months);
  const futureValue =
    (data.currentSavings + currentAssets) * growthFactor +
    monthlyContribution * (((growthFactor - 1) / monthlyRate) * (1 + monthlyRate));

  return futureValue;
}

function getAssetValueAtYear(asset, year) {
  const startYear = new Date().getFullYear();
  const yearsAhead = Math.max(0, year - startYear);
  let value = Number(asset.value) || 0;
  let annualRate = Number(asset.interestRate) || 0;
  const yearlyContribution = (Number(asset.monthlyContribution) || 0) * 12;
  const futureEvents = [...(asset.events || [])]
    .filter((event) => Number(event.year) > startYear && Number(event.year) <= year)
    .sort((a, b) => Number(a.year) - Number(b.year));

  for (let offset = 1; offset <= yearsAhead; offset += 1) {
    const projectionYear = startYear + offset;
    for (const event of futureEvents.filter((item) => Number(item.year) === projectionYear)) {
      const amount = Number(event.amount) || 0;
      if (event.type === "rate-change") {
        annualRate = amount;
      } else if (event.type === "buy" || event.type === "contribution" || event.type === "income") {
        value += amount;
      } else if (event.type === "sell" || event.type === "maintenance" || event.type === "expense") {
        value -= Math.abs(amount);
      }
    }

    value *= 1 + annualRate / 100;
    if (asset.type === "loan") {
      value = Math.max(0, value - yearlyContribution);
    } else {
      value += yearlyContribution;
    }
    value = Math.max(0, value);
  }

  return value;
}

function getAssetCashflowAtYear(asset, year, inflationRate) {
  const yearsAhead = Math.max(0, year - new Date().getFullYear());
  const inflationFactor = Math.pow(1 + inflationRate / 100, yearsAhead);
  const monthlyAmount = Number(asset.monthlyContribution) || 0;
  let income = asset.type === "income" ? monthlyAmount * 12 : 0;
  let expenses = asset.type === "income" ? 0 : monthlyAmount * 12;

  for (const event of asset.events || []) {
    if (Number(event.year) !== year || event.type === "rate-change") continue;
    const amount = Math.abs(Number(event.amount) || 0);
    if (event.type === "income" || event.type === "sell") {
      income += amount;
    } else {
      expenses += amount;
    }
  }

  income *= inflationFactor;
  expenses *= inflationFactor;
  return { income, expenses, net: income - expenses };
}

function renderAssetCashflow(asset, isOpen) {
  const years = getProjectionYears();
  const inflationRate = Number(state.inflationRate) || 0;
  const valueMode = document.getElementById("projectionValueMode").value;
  const rows = years.map((year) => {
    const cashflow = getAssetCashflowAtYear(asset, year, inflationRate);
    const factor = Math.pow(1 + inflationRate / 100, year - new Date().getFullYear());
    const values = (amount) => valueMode === "both"
      ? `<td>${formatCurrency(amount)}</td><td class="today-value">${formatCurrency(amount / factor)}</td>`
      : `<td>${formatCurrency(valueMode === "today" ? amount / factor : amount)}</td>`;
    return `
      <tr>
        <th scope="row">${year}</th>
        ${values(cashflow.income)}
        ${values(cashflow.expenses)}
        ${values(cashflow.net)}
      </tr>
    `;
  }).join("");

  return `
    <details class="asset-cashflow" ${isOpen ? "open" : ""}>
      <summary>${t("assetCashFlow")}</summary>
      <div class="asset-cashflow-table-wrap">
        <table class="asset-cashflow-table">
          <thead>
            <tr>
              <th rowspan="${valueMode === "both" ? 2 : 1}">${t("year")}</th>
              <th colspan="${valueMode === "both" ? 2 : 1}">${t("annualIncome")}</th>
              <th colspan="${valueMode === "both" ? 2 : 1}">${t("annualExpenses")}</th>
              <th colspan="${valueMode === "both" ? 2 : 1}">${t("annualNetCashFlow")}</th>
            </tr>
            ${valueMode === "both" ? `<tr><th>${t("nominalOption")}</th><th>${t("todayOption")}</th><th>${t("nominalOption")}</th><th>${t("todayOption")}</th><th>${t("nominalOption")}</th><th>${t("todayOption")}</th></tr>` : ""}
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </details>
  `;
}

function getProjectionYears() {
  const currentYear = new Date().getFullYear();
  const horizon = Math.min(100, Math.max(1, Math.round(Number(state.years) || 1)));
  const interval = Number(document.getElementById("projectionInterval").value) || 1;
  const years = [currentYear];

  for (let offset = interval; offset < horizon; offset += interval) {
    years.push(currentYear + offset);
  }

  const finalYear = currentYear + horizon;
  if (years[years.length - 1] !== finalYear) {
    years.push(finalYear);
  }

  return years;
}

function renderAssetProjection() {
  const container = document.getElementById("assetProjection");
  if (!container) return;

  const data = readForm();
  const years = getProjectionYears();
  const inflationRate = Number(data.inflationRate) || 0;
  const valueMode = document.getElementById("projectionValueMode").value;
  const showCashFlowDetails = cashFlowBreakdownOpen;
  const assets = [...state.assets].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  const valueColumnCount = valueMode === "both" ? 2 : 1;
  const cashFlowColumns = showCashFlowDetails
    ? [
        { key: "income", label: t("income") },
        { key: "expenses", label: t("expenses") },
        { key: "investments", label: t("investments") },
        { key: "net", label: t("netCashFlow") },
      ]
    : [{ key: "net", label: t("netCashFlow") }];
  const cashFlowHeader = cashFlowColumns
    .map((column) => `<th class="asset-column-heading" colspan="${valueColumnCount}">${column.label}</th>`)
    .join("");
  const assetHeader = assets.map((asset) =>
    `<th class="asset-column-heading" colspan="${valueColumnCount}">${escapeHtml(getAssetName(asset))}${asset.type === "loan" ? ` (${t("liability")})` : ""}</th>`,
  ).join("");
  const valueHeader = valueMode === "both"
    ? `<th>${t("nominalOption")}</th><th>${t("todayOption")}</th>`
    : `<th>${t(valueMode === "today" ? "todayOption" : "nominalOption")}</th>`;
  const displayValues = (value, inflationFactor) => valueMode === "both"
    ? `<td>${formatCurrency(value)}</td><td class="today-value">${formatCurrency(value / inflationFactor)}</td>`
    : `<td>${formatCurrency(valueMode === "today" ? value / inflationFactor : value)}</td>`;
  const rows = years.map((year) => {
    const yearsAhead = year - new Date().getFullYear();
    const inflationFactor = Math.pow(1 + inflationRate / 100, yearsAhead);
    const annualIncome = (data.salary + data.sideIncome * 12) * inflationFactor;
    const annualExpenses =
      (data.rent + data.food + data.insurance + data.transport + data.leisure) * 12 * inflationFactor;
    const annualInvestments = (data.investment + data.pensionContribution) * 12 * inflationFactor;
    const annualNetCashFlow = annualIncome - annualExpenses - annualInvestments;
    const annualCashFlowValues = { income: annualIncome, expenses: annualExpenses, investments: annualInvestments, net: annualNetCashFlow };
    const cashFlowValues = cashFlowColumns
      .map((column) => displayValues(annualCashFlowValues[column.key], inflationFactor))
      .join("");
    const values = assets.map((asset) => {
      const nominalValue = getAssetValueAtYear(asset, year);
      return displayValues(nominalValue, inflationFactor);
    }).join("");
    return `<tr><th scope="row">${year}</th>${cashFlowValues}${values}</tr>`;
  }).join("");

  container.innerHTML = `
    <table class="projection-table">
      <thead>
        <tr><th rowspan="3">${t("year")}</th><th colspan="${cashFlowColumns.length * valueColumnCount}">${t("cashFlowGroup")}</th>${assets.length ? `<th colspan="${assets.length * valueColumnCount}">${t("assetGroup")}</th>` : ""}</tr>
        <tr>${cashFlowHeader}${assetHeader}</tr>
        <tr>${cashFlowColumns.map(() => valueHeader).join("")}${assets.map(() => valueHeader).join("")}</tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function updateSummary() {
  const data = readForm();
  updateAgeDisplay();
  const cashFlow = calculateCashFlow(data);
  const taxEstimate = calculateTaxEstimate(data);
  const portfolioValue = calculatePortfolio(data);

  document.getElementById("monthlyNet").textContent = formatCurrency(cashFlow.monthlyNet);
  document.getElementById("annualTax").textContent = formatCurrency(taxEstimate);
  document.getElementById("annualSavings").textContent = formatCurrency(cashFlow.annualSavings);
  document.getElementById("portfolioValue").textContent = formatCurrency(portfolioValue);
  renderAssets();
}

function toYaml(data) {
  const lines = [
    "name: " + JSON.stringify(data.name),
    "city: " + JSON.stringify(data.city),
    'birthDate: "' + String(data.birthDate || "") + '"',
    "taxClass: " + data.taxClass,
    "childAllowance: " + Number(data.childAllowance),
    "church: " + data.church,
    "householdType: " + data.householdType,
    "salary: " + Number(data.salary),
    "sideIncome: " + Number(data.sideIncome),
    "rent: " + Number(data.rent),
    "food: " + Number(data.food),
    "insurance: " + Number(data.insurance),
    "transport: " + Number(data.transport),
    "leisure: " + Number(data.leisure),
    "investment: " + Number(data.investment),
    "currentSavings: " + Number(data.currentSavings),
    "annualReturn: " + Number(data.annualReturn),
    "years: " + Number(data.years),
    "inflationRate: " + Number(data.inflationRate),
    "pensionContribution: " + Number(data.pensionContribution),
    data.assets.length ? "assets:" : "assets: []",
  ];

  if (Array.isArray(data.assets)) {
    data.assets.forEach((asset) => {
      lines.push("  - type: " + asset.type);
      if (asset.subtype) lines.push("    subtype: " + asset.subtype);
      lines.push("    name: " + JSON.stringify(asset.name));
      lines.push("    value: " + Number(asset.value));
      lines.push("    interestRate: " + Number(asset.interestRate));
      lines.push("    monthlyContribution: " + Number(asset.monthlyContribution));
      lines.push("    acquisitionYear: " + Number(asset.acquisitionYear));
      for (const key of ["taxNotes", "allowanceNotes", "subsidyNotes"]) {
        lines.push("    " + key + ": " + JSON.stringify(asset[key] || ""));
      }
      lines.push(asset.events?.length ? "    events:" : "    events: []");
      if (Array.isArray(asset.events) && asset.events.length > 0) {
        asset.events.forEach((event) => {
          lines.push("      - type: " + event.type);
          lines.push("        year: " + Number(event.year));
          lines.push("        amount: " + Number(event.amount));
          lines.push("        description: " + JSON.stringify(event.description || ""));
        });
      }
    });
  }

  return lines.join("\n");
}

function parseYaml(text) {
  const parsed = jsyaml.load(text, { schema: jsyaml.JSON_SCHEMA });
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Expected a YAML mapping.");
  }
  const validated = {};
  for (const key of Object.keys(idMap)) {
    if (!Object.hasOwn(parsed, key)) continue;
    const value = parsed[key];
    const input = document.getElementById(idMap[key]);
    if (numericFields.includes(key)) {
      if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Invalid ${key}.`);
    } else if (!["string", "number"].includes(typeof value)) {
      throw new Error(`Invalid ${key}.`);
    }
    const candidate = input.cloneNode(true);
    candidate.value = String(value);
    if (candidate.value !== String(value) || !candidate.checkValidity()) throw new Error(`Invalid ${key}.`);
    validated[key] = value;
  }
  if (Object.hasOwn(parsed, "assets")) {
    if (!Array.isArray(parsed.assets)) throw new Error("Expected an assets list.");
    const types = [...document.getElementById("assetType").options].map((option) => option.value);
    validated.assets = parsed.assets.map((asset, assetIndex) => {
      if (!asset || !types.includes(asset.type) || typeof asset.name !== "string") throw new Error("Invalid asset.");
      for (const key of ["value", "interestRate", "monthlyContribution", "acquisitionYear"]) {
        if (typeof asset[key] !== "number" || !Number.isFinite(asset[key])) throw new Error(`Invalid asset ${key}.`);
      }
      if (asset.subtype !== undefined && !Object.hasOwn(wealthProducts, asset.subtype)) throw new Error("Invalid wealth product.");
      for (const key of ["taxNotes", "allowanceNotes", "subsidyNotes"]) {
        if (asset[key] !== undefined && typeof asset[key] !== "string") throw new Error(`Invalid ${key}.`);
      }
      if (asset.events !== undefined && !Array.isArray(asset.events)) throw new Error("Invalid events.");
      const events = (asset.events || []).map((event, eventIndex) => {
        if (!event || !["buy", "sell", "contribution", "rate-change", "maintenance", "income", "expense"].includes(event.type) ||
          !Number.isInteger(event.year) || !Number.isFinite(event.amount) ||
          (event.description !== undefined && typeof event.description !== "string")) throw new Error("Invalid asset event.");
        return { id: `event-import-${assetIndex}-${eventIndex}`, type: event.type, year: event.year, amount: event.amount, description: event.description || "" };
      });
      return {
        id: `asset-import-${assetIndex}`, type: asset.type, name: asset.name, value: asset.value,
        interestRate: asset.interestRate, monthlyContribution: asset.monthlyContribution,
        acquisitionYear: asset.acquisitionYear, ...(asset.subtype ? { subtype: asset.subtype } : {}),
        taxNotes: asset.taxNotes || "", allowanceNotes: asset.allowanceNotes || "", subsidyNotes: asset.subsidyNotes || "", events,
      };
    });
  }
  if (!Object.keys(validated).length) throw new Error("No recognized finance data.");
  return validated;
}

function loadYamlText(text) {
  const parsed = parseYaml(text);
  for (const [key, value] of Object.entries(parsed)) {
    if (key === "assets") continue;
    document.getElementById(idMap[key]).value = value;
  }
  if (parsed.assets) state.assets = parsed.assets;
  updateSummary();
  document.getElementById("yamlOutput").value = toYaml(state);
  document.getElementById("fileStatus").textContent = t("yamlLoaded");
}

function applyYamlData() {
  try {
    loadYamlText(document.getElementById("yamlOutput").value);
    document.getElementById("yamlError").textContent = "";
    document.getElementById("yamlDialog").close();
  } catch (error) {
    document.getElementById("yamlError").textContent = t("yamlFailure") + error.message;
  }
}

function renderAssets() {
  const container = document.getElementById("assetsList");
  if (!container) return;

  if (!state.assets || state.assets.length === 0) {
    container.innerHTML = `<p class="empty-state">${t("noAssets")}</p>`;
    renderAssetProjection();
    return;
  }

  const hasRenderedAssets = container.querySelector("details[data-asset-id]") !== null;
  const previouslyOpen = new Set(
    [...container.querySelectorAll("details[data-asset-id][open]")].map((element) => element.dataset.assetId),
  );
  const openTimelines = new Set(
    [...container.querySelectorAll(".asset-timeline[open]")].map((element) => element.closest("[data-asset-id]").dataset.assetId),
  );
  const openCashflows = new Set(
    [...container.querySelectorAll(".asset-cashflow[open]")].map((element) => element.closest("[data-asset-id]").dataset.assetId),
  );
  const selectedView = document.getElementById("assetView").value;
  container.classList.toggle("view-list", selectedView === "list");
  const sortedAssets = [...state.assets].sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  container.innerHTML = sortedAssets
    .map((asset) => {
      const orderedEvents = [...(asset.events || [])].sort((a, b) => Number(a.year) - Number(b.year));
      const isOpen = hasRenderedAssets && previouslyOpen.has(asset.id);

      return `
        <details class="asset-card" data-asset-id="${escapeHtml(asset.id)}" ${isOpen ? "open" : ""}>
          <summary>
            <div class="asset-summary-heading">
              <span class="disclosure-indicator" aria-hidden="true">▶</span>
              <div>
                <p class="asset-type">${escapeHtml(getAssetTypeLabel(asset.type, asset.subtype))}</p>
                <h3>${escapeHtml(getAssetName(asset))}</h3>
              </div>
            </div>
            <span>${formatCurrency(asset.value)}</span>
          </summary>
          <div class="asset-card-content">
            <div class="asset-header">
              <strong>${t("assetDetails")}</strong>
              <button type="button" class="secondary-button danger-button" data-action="delete-asset" data-asset-id="${escapeHtml(asset.id)}">${t("remove")}</button>
            </div>

            <div class="asset-meta">
              <div class="asset-meta-item">
                <span>${asset.type === "loan" ? t("valueOwed") : t("value")}</span>
                <strong>${formatCurrency(asset.value)}</strong>
              </div>
              <div class="asset-meta-item">
                <span>${t("annualInterestRate")}</span>
                <strong>${Number(asset.interestRate || 0).toFixed(1)}%</strong>
              </div>
              <div class="asset-meta-item">
                <span>${asset.type === "loan" ? t("monthlyRepayment") : t(asset.type === "income" ? "monthlyIncome" : "monthlyContribution")}</span>
                <strong>${formatCurrency(asset.monthlyContribution || 0)}</strong>
              </div>
              <div class="asset-meta-item">
                <span>${t("acquired")}</span>
                <strong>${Number(asset.acquisitionYear) || "—"}</strong>
              </div>
            </div>

            ${asset.type === "wealth" ? `<p class="wealth-treatment"><strong>${t("wealthTaxTreatment")}:</strong> ${t("wealthNoTaxCalculation")} ${t((wealthProducts[asset.subtype] || wealthProducts.general).treatmentKey)}</p>` : ""}
            <p id="taxNotesHelp-${escapeHtml(asset.id)}">${t("assetTaxNotesHelp")}</p>
            <div class="form-grid asset-tax-notes">
              ${[
                ["taxNotes", "assetTaxNotes"],
                ["allowanceNotes", "assetAllowanceNotes"],
                ["subsidyNotes", "assetSubsidyNotes"],
              ].map(([key, label]) => `
                <label>
                  <span>${t(label)}</span>
                  <input type="text" data-note-field="${key}" value="${escapeHtml(asset[key] || "")}" aria-describedby="taxNotesHelp-${escapeHtml(asset.id)}" />
                </label>
              `).join("")}
            </div>
            ${renderAssetCashflow(asset, openCashflows.has(asset.id))}

            <div class="asset-event-form">
              <label>
                ${t("eventType")}
                <select id="eventType-${escapeHtml(asset.id)}">
                  <option value="buy">${t("buy")}</option>
                  <option value="contribution">${t("contribution")}</option>
                  <option value="rate-change">${t("rateChange")}</option>
                  <option value="sell">${t("sell")}</option>
                  <option value="maintenance">${t("maintenance")}</option>
                  <option value="income">${t("income")}</option>
                  <option value="expense">${t("expense")}</option>
                </select>
              </label>
              <label>
                ${t("eventYear")}
                <input id="eventYear-${escapeHtml(asset.id)}" type="number" value="${new Date().getFullYear()}" />
              </label>
              <label>
                ${asset.type === "loan" ? t("amountRate") : t("amount")}
                <input id="eventAmount-${escapeHtml(asset.id)}" type="number" value="1000" />
              </label>
              <label>
                ${t("description")}
                <input id="eventDescription-${escapeHtml(asset.id)}" type="text" value="" placeholder="${t("optionalNote")}" />
              </label>
              <div>
                <button type="button" data-action="add-event" data-asset-id="${escapeHtml(asset.id)}">${t("addEvent")}</button>
              </div>
            </div>

            <details class="asset-timeline" ${openTimelines.has(asset.id) ? "open" : ""}>
              <summary>${t("eventTimeline")} (${orderedEvents.length})</summary>
              <div class="timeline">
                ${
                  orderedEvents.length > 0
                    ? orderedEvents
                        .map(
                          (event) => `
                            <div class="timeline-item">
                              <div class="timeline-bullet"></div>
                              <div class="timeline-content">
                                <div class="timeline-header">
                                  <strong>${escapeHtml(getEventLabel(event.type))}</strong>
                                  <span>${Number(event.year)}</span>
                                </div>
                                <p>${escapeHtml(getEventDescription(event))}</p>
                                <small>${event.type === "rate-change" ? `${Number(event.amount).toFixed(1)}%` : `${Number(event.amount) >= 0 ? "+" : "-"}${formatCurrency(Math.abs(Number(event.amount)))}`}</small>
                              </div>
                            </div>
                          `,
                        )
                        .join("")
                    : `<p class="empty-state">${t("noEvents")}</p>`
                }
              </div>
            </details>
          </div>
        </details>
      `;
    })
    .join("");

  renderAssetProjection();
}

function addAsset(event) {
  event.preventDefault();

  const type = document.getElementById("assetType").value;
  const subtype = type === "wealth" ? document.getElementById("wealthProduct").value : undefined;
  const name = document.getElementById("assetName").value.trim() || t("newAsset");
  const value = Number.parseFloat(document.getElementById("assetValue").value) || 0;
  const interestRate = Number.parseFloat(document.getElementById("assetRate").value) || 0;
  const monthlyContribution = Number.parseFloat(document.getElementById("assetContribution").value) || 0;
  const acquisitionYear = Number.parseInt(document.getElementById("assetYear").value, 10) || new Date().getFullYear();

  state.assets.push({
    id: `asset-${Date.now()}`,
    type,
    ...(subtype ? { subtype } : {}),
    name,
    value,
    interestRate,
    monthlyContribution,
    acquisitionYear,
    taxNotes: document.getElementById("assetTaxNotes").value,
    allowanceNotes: document.getElementById("assetAllowanceNotes").value,
    subsidyNotes: document.getElementById("assetSubsidyNotes").value,
    events: [
      {
        id: `event-${Date.now()}`,
        type: "buy",
        year: acquisitionYear,
        amount: value,
        description: t("initialPurchase").replace("{type}", getAssetTypeLabel(type, subtype)),
      },
    ],
  });

  document.getElementById("assetForm").reset();
  document.getElementById("assetType").value = type;
  document.getElementById("wealthProduct").value = subtype || "general";
  updateWealthProductUI();
  document.getElementById("assetName").value = "";
  document.getElementById("assetValue").value = "10000";
  document.getElementById("assetRate").value = "4";
  document.getElementById("assetContribution").value = "0";
  document.getElementById("assetYear").value = new Date().getFullYear();

  renderAssets();
  updateSummary();
}

function deleteAsset(assetId) {
  state.assets = state.assets.filter((asset) => asset.id !== assetId);
  renderAssets();
  updateSummary();
}

function addAssetEvent(assetId) {
  const asset = state.assets.find((item) => item.id === assetId);
  if (!asset) return;

  const type = document.getElementById(`eventType-${assetId}`).value;
  const year = Number.parseInt(document.getElementById(`eventYear-${assetId}`).value, 10) || new Date().getFullYear();
  const amount = Number.parseFloat(document.getElementById(`eventAmount-${assetId}`).value) || 0;
  const description = document.getElementById(`eventDescription-${assetId}`).value.trim() || getEventLabel(type);

  const event = {
    id: `event-${Date.now()}`,
    type,
    year,
    amount,
    description,
  };

  asset.events.push(event);

  if (year <= new Date().getFullYear()) {
    if (type === "buy" || type === "contribution" || type === "income") {
      asset.value += amount;
    }
    if (type === "sell" || type === "maintenance" || type === "expense") {
      asset.value = Math.max(0, asset.value - Math.abs(amount));
    }
    if (type === "rate-change") {
      asset.interestRate = Number(amount);
    }
  }

  renderAssets();
  updateSummary();
}

function bindEvents() {
  document.querySelectorAll("input, select").forEach((element) => {
    if (element.id === "languageSwitch" || element.closest("#assetForm") || element.closest(".asset-event-form")) return;
    element.addEventListener("input", updateSummary);
    element.addEventListener("change", updateSummary);
  });

  document.getElementById("assetForm").addEventListener("submit", addAsset);
  document.getElementById("assetsList").addEventListener("input", (event) => {
    const field = event.target.dataset.noteField;
    if (!["taxNotes", "allowanceNotes", "subsidyNotes"].includes(field)) return;
    const assetId = event.target.closest("[data-asset-id]").dataset.assetId;
    const asset = state.assets.find((item) => item.id === assetId);
    if (asset) asset[field] = event.target.value;
  });
  document.getElementById("assetType").addEventListener("change", () => {
    updateAssetContributionLabel();
    if (document.getElementById("assetType").value === "wealth") {
      applyWealthProductPreset(true);
    } else {
      updateWealthProductUI();
    }
  });
  document.getElementById("wealthProduct").addEventListener("change", () => applyWealthProductPreset());
  document.getElementById("birthDate").addEventListener("change", () => {
    const subtype = document.getElementById("wealthProduct").value;
    if (document.getElementById("assetType").value === "wealth" && wealthProducts[subtype]?.retirement) {
      setRetirementHorizon();
      updateWealthProductUI();
    }
    updateSummary();
  });

  document.getElementById("assetsList").addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;

    const action = actionTarget.dataset.action;
    const assetId = actionTarget.dataset.assetId;

    if (action === "delete-asset") {
      deleteAsset(assetId);
      return;
    }

    if (action === "add-event") {
      addAssetEvent(assetId);
    }
  });

  document.getElementById("loadYaml").addEventListener("click", () => {
    document.getElementById("yamlFile").click();
  });
  document.getElementById("yamlFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      loadYamlText(await file.text());
    } catch (error) {
      document.getElementById("fileStatus").textContent = t("yamlFailure") + error.message;
    } finally {
      event.target.value = "";
    }
  });
  document.getElementById("saveYaml").addEventListener("click", () => {
    const blob = new Blob([toYaml(readForm())], { type: "application/yaml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fincalc.yaml";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.getElementById("fileStatus").textContent = t("yamlSaved");
  });
  document.getElementById("shareYaml").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error(t("clipboardUnavailable"));
      await navigator.clipboard.writeText(toYaml(readForm()));
      document.getElementById("fileStatus").textContent = t("yamlCopied");
    } catch (error) {
      document.getElementById("fileStatus").textContent = t("yamlFailure") + error.message;
    }
  });
  document.getElementById("showYaml").addEventListener("click", () => {
    document.getElementById("yamlOutput").value = toYaml(readForm());
    document.getElementById("yamlError").textContent = "";
    document.getElementById("yamlDialog").showModal();
  });
  document.getElementById("closeYaml").addEventListener("click", () => {
    document.getElementById("yamlDialog").close();
  });

  document.getElementById("importYaml").addEventListener("click", applyYamlData);
  document.getElementById("projectionInterval").addEventListener("change", renderAssetProjection);
  document.getElementById("projectionValueMode").addEventListener("change", () => {
    localStorage.setItem("fincalc-projection-value-mode", document.getElementById("projectionValueMode").value);
    renderAssets();
  });
  document.getElementById("cashFlowBreakdown").addEventListener("toggle", (event) => {
    cashFlowBreakdownOpen = event.currentTarget.open;
    updateCashFlowBreakdownLabel();
    renderAssetProjection();
  });
  document.getElementById("assetView").addEventListener("change", () => {
    localStorage.setItem("fincalc-asset-view", document.getElementById("assetView").value);
    renderAssets();
  });
  document.getElementById("languageSwitch").addEventListener("change", (event) => {
    currentLanguage = event.target.value === "de" ? "de" : "en";
    localStorage.setItem("fincalc-language", currentLanguage);
    applyLanguage();
    updateSummary();
  });
}

function initialize() {
  bindEvents();
  const savedAssetView = localStorage.getItem("fincalc-asset-view");
  if (savedAssetView === "list" || savedAssetView === "cards") {
    document.getElementById("assetView").value = savedAssetView;
  }
  const savedValueMode = localStorage.getItem("fincalc-projection-value-mode");
  if (savedValueMode === "nominal" || savedValueMode === "today" || savedValueMode === "both") {
    document.getElementById("projectionValueMode").value = savedValueMode;
  }
  applyLanguage();
  document.getElementById("yamlOutput").value = toYaml(state);
  updateSummary();
}

initialize();
