const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { JSDOM } = require("jsdom");

const root = path.join(__dirname, "..");
const html = readFileSync(path.join(root, "index.html"), "utf8");
const appScript = readFileSync(path.join(root, "app.js"), "utf8");

function createApp() {
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: "http://localhost/",
  });
  dom.window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  dom.window.HTMLDialogElement.prototype.close = function () { this.open = false; };
  dom.window.eval(readFileSync(path.join(root, "vendor/js-yaml.min.js"), "utf8"));
  dom.window.eval(appScript);
  return dom;
}

function dispatch(dom, element, eventName) {
  element.dispatchEvent(new dom.window.Event(eventName, { bubbles: true }));
}

function localDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

test("projection is a standalone full-width main panel with working display controls", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;
  const panel = document.getElementById("projectionPanel");
  assert.ok(panel.classList.contains("full-width-panel"));
  assert.equal(panel.parentElement.tagName, "MAIN");
  assert.equal(panel.closest("details"), null);
  assert.equal(panel.closest(".assets-panel"), null);
  assert.ok(panel.contains(document.getElementById("assetProjection")));
  assert.ok(panel.querySelector(".projection-table tbody tr"));
  document.getElementById("projectionInterval").value = "10";
  dispatch(dom, document.getElementById("projectionInterval"), "change");
  assert.equal(panel.querySelectorAll(".projection-table tbody tr").length, 3);
  document.getElementById("languageSwitch").value = "de";
  dispatch(dom, document.getElementById("languageSwitch"), "change");
  assert.equal(document.getElementById("projectionHeading").textContent, "Vermögens- & Cashflow-Prognose");
});

test("full-width personal data and cash flow panels and add asset expand independently", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;
  const personal = document.getElementById("personalDataDetails");
  const cashFlow = document.getElementById("cashFlowDetails");
  const addAsset = document.getElementById("addAssetDetails");

  assert.equal(personal.open, false);
  assert.equal(cashFlow.open, false);
  assert.equal(addAsset.open, false);
  assert.ok(personal.closest(".full-width-panel"));
  assert.ok(cashFlow.closest(".full-width-panel"));
  assert.ok(cashFlow.contains(document.getElementById("salary")));
  assert.ok(personal.contains(document.getElementById("birthDate")));
  assert.ok(addAsset.contains(document.getElementById("assetForm")));
  assert.equal(addAsset.contains(document.getElementById("assetsList")), false);

  personal.querySelector("summary").click();
  assert.equal(personal.open, true);
  assert.equal(addAsset.open, false);
  cashFlow.querySelector("summary").click();
  assert.equal(cashFlow.open, true);
  document.getElementById("salary").value = "80000";
  cashFlow.querySelector("summary").click();
  cashFlow.querySelector("summary").click();
  assert.equal(document.getElementById("salary").value, "80000");
  document.getElementById("name").value = "Test Person";
  personal.querySelector("summary").click();
  personal.querySelector("summary").click();
  assert.equal(document.getElementById("name").value, "Test Person");

  addAsset.querySelector("summary").click();
  assert.equal(addAsset.open, true);
  document.getElementById("languageSwitch").value = "de";
  dispatch(dom, document.getElementById("languageSwitch"), "change");
  assert.equal(personal.querySelector("summary").textContent, "Persönliche Daten");
  assert.equal(cashFlow.querySelector("summary").textContent, "Cashflow");
  assert.equal(addAsset.querySelector("summary").textContent, "Vermögenswert hinzufügen");
  assert.equal(personal.open, true);
  assert.equal(cashFlow.open, true);
  assert.equal(addAsset.open, true);
});

test("child allowance and church membership round-trip without changing the tax estimate", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;
  const originalTax = document.getElementById("annualTax").textContent;
  const allowance = document.getElementById("childAllowance");
  const church = document.getElementById("church");

  allowance.value = "0.5";
  dispatch(dom, allowance, "input");
  church.value = "catholic";
  dispatch(dom, church, "change");
  assert.equal(document.getElementById("annualTax").textContent, originalTax);
  assert.equal(allowance.checkValidity(), true);

  document.getElementById("showYaml").click();
  const yaml = document.getElementById("yamlOutput").value;
  assert.match(yaml, /childAllowance: 0.5/);
  assert.match(yaml, /church: catholic/);

  allowance.value = "0";
  church.value = "none";
  document.getElementById("importYaml").click();
  assert.equal(allowance.value, "0.5");
  assert.equal(church.value, "catholic");
  assert.equal(document.getElementById("annualTax").textContent, originalTax);

  document.getElementById("languageSwitch").value = "de";
  dispatch(dom, document.getElementById("languageSwitch"), "change");
  assert.equal(allowance.labels[0].textContent.trim(), "Kinderfreibetrag (Zähler)");
  assert.equal(church.selectedOptions[0].textContent, "Römisch-katholisch");
  assert.match(document.getElementById("taxProfileNote").textContent, /beeinflussen die Steuerschätzung nicht/);

});

test("all assets support editable tax, allowance and subsidy notes without changing calculations", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;
  const originalTax = document.getElementById("annualTax").textContent;
  const originalPortfolio = document.getElementById("portfolioValue").textContent;
  const cards = [...document.querySelectorAll(".asset-card")];
  for (const card of cards) {
    assert.equal(card.querySelectorAll("[data-note-field]").length, 3);
  }

  const note = cards[0].querySelector('[data-note-field="allowanceNotes"]');
  note.value = 'Shared allowance: "household" <not per asset>';
  dispatch(dom, note, "input");
  document.getElementById("languageSwitch").value = "de";
  dispatch(dom, document.getElementById("languageSwitch"), "change");
  assert.equal(document.querySelector('[data-note-field="allowanceNotes"]').value, note.value);
  document.getElementById("languageSwitch").value = "en";
  dispatch(dom, document.getElementById("languageSwitch"), "change");
  assert.equal(document.getElementById("annualTax").textContent, originalTax);
  assert.equal(document.getElementById("portfolioValue").textContent, originalPortfolio);

  document.getElementById("assetTaxNotes").value = "Tax assumption";
  document.getElementById("assetAllowanceNotes").value = "Shared allowance";
  document.getElementById("assetSubsidyNotes").value = "Eligibility not confirmed";
  document.getElementById("assetName").value = "Notes test asset";
  document.getElementById("assetForm").dispatchEvent(
    new dom.window.Event("submit", { bubbles: true, cancelable: true }),
  );
  const added = [...document.querySelectorAll(".asset-card")].find((card) =>
    card.querySelector("h3").textContent === "Notes test asset",
  );
  assert.equal(added.querySelector('[data-note-field="taxNotes"]').value, "Tax assumption");
  assert.equal(added.querySelector('[data-note-field="subsidyNotes"]').value, "Eligibility not confirmed");
  document.getElementById("showYaml").click();
  const yaml = document.getElementById("yamlOutput").value;
  assert.ok(yaml.includes("allowanceNotes: " + JSON.stringify(note.value)));
  assert.match(yaml, /taxNotes: "Tax assumption"/);
  assert.match(yaml, /subsidyNotes: "Eligibility not confirmed"/);
});

test("YAML is shown only in a closable dialog and reflects current data", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;

  assert.equal(document.getElementById("birthDate").value, "1990-01-15");
  assert.match(document.getElementById("yamlOutput").value, /birthDate: "1990-01-15"/);

  document.getElementById("birthDate").value = "1980-06-20";
  dispatch(dom, document.getElementById("birthDate"), "change");
  assert.equal(document.getElementById("yamlDialog").open, false);
  document.getElementById("showYaml").click();
  assert.equal(document.getElementById("yamlDialog").open, true);
  assert.match(document.getElementById("yamlOutput").value, /birthDate: "1980-06-20"/);
  assert.ok(document.getElementById("yamlOutput").closest("dialog"));
  document.getElementById("closeYaml").click();
  assert.equal(document.getElementById("yamlDialog").open, false);
  assert.equal(document.getElementById("load-demo"), null);
});

test("YAML load restores nested assets, events and escaped notes and rejects invalid data atomically", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;
  document.getElementById("name").value = 'Test "Person"\nSecond line';
  const note = document.querySelector('[data-note-field="taxNotes"]');
  note.value = 'Notes with "quotes" and \\slashes';
  dispatch(dom, note, "input");
  document.getElementById("showYaml").click();
  const yaml = document.getElementById("yamlOutput").value;
  const parser = require("js-yaml");
  const exported = parser.load(yaml);

  document.getElementById("yamlOutput").value = "assets: []";
  document.getElementById("importYaml").click();
  assert.equal(document.querySelectorAll(".asset-card").length, 0);
  document.getElementById("showYaml").click();
  document.getElementById("yamlOutput").value = yaml;
  document.getElementById("importYaml").click();
  assert.equal(document.getElementById("yamlError").textContent, "");
  assert.equal(document.getElementById("yamlDialog").open, false);
  assert.equal(document.querySelectorAll(".asset-card").length, exported.assets.length);
  document.getElementById("showYaml").click();
  assert.deepEqual(parser.load(document.getElementById("yamlOutput").value), exported);

  document.getElementById("yamlOutput").value = 'salary: 100\nassets:\n  - type: unknown';
  document.getElementById("importYaml").click();
  assert.notEqual(document.getElementById("yamlError").textContent, "");
  assert.equal(document.getElementById("salary").value, String(exported.salary));
  assert.equal(document.getElementById("yamlDialog").open, true);
});

test("Load opens a file picker and loads a YAML file", async (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;
  const picker = document.getElementById("yamlFile");
  let pickerOpened = false;
  picker.addEventListener("click", () => { pickerOpened = true; });
  document.getElementById("loadYaml").click();
  assert.equal(pickerOpened, true);
  Object.defineProperty(picker, "files", { value: [{ text: async () => 'name: "Loaded person"\nassets: []' }] });
  dispatch(dom, picker, "change");
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(document.getElementById("name").value, "Loaded person");
  assert.equal(document.querySelectorAll(".asset-card").length, 0);
  assert.equal(document.getElementById("fileStatus").textContent, "YAML loaded.");
});

test("Save downloads current YAML and Share copies it with visible failure feedback", async (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;
  let savedBlob;
  let downloadName;
  dom.window.URL.createObjectURL = (blob) => { savedBlob = blob; return "blob:test"; };
  dom.window.URL.revokeObjectURL = () => {};
  dom.window.HTMLAnchorElement.prototype.click = function () { downloadName = this.download; };
  document.getElementById("saveYaml").click();
  assert.equal(downloadName, "fincalc.yaml");
  assert.equal(savedBlob.type, "application/yaml;charset=utf-8");
  assert.ok(savedBlob.size > 0);
  const savedText = await new Promise((resolve, reject) => {
    const reader = new dom.window.FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(savedBlob);
  });

  let copied;
  Object.defineProperty(dom.window.navigator, "clipboard", {
    value: { writeText: async (text) => { copied = text; } }, configurable: true,
  });
  document.getElementById("shareYaml").click();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.match(copied, /birthDate: "1990-01-15"/);
  assert.equal(savedText, copied);
  assert.equal(document.getElementById("fileStatus").textContent, "YAML copied to clipboard.");
  dom.window.navigator.clipboard.writeText = async () => { throw new Error("Permission denied"); };
  document.getElementById("shareYaml").click();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.match(document.getElementById("fileStatus").textContent, /Permission denied/);
});

test("date of birth displays age and updates the retirement-product horizon", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;

  document.getElementById("assetType").value = "wealth";
  dispatch(dom, document.getElementById("assetType"), "change");
  document.getElementById("wealthProduct").value = "riester";
  dispatch(dom, document.getElementById("wealthProduct"), "change");

  const today = new Date();
  const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
  document.getElementById("birthDate").value = localDateValue(birthDate);
  dispatch(dom, document.getElementById("birthDate"), "change");

  assert.match(document.getElementById("ageDisplay").textContent, /30/);
  assert.equal(document.getElementById("years").value, "37");
  assert.equal(document.getElementById("wealthProductControl").hidden, false);
  assert.match(document.getElementById("wealthProductNote").textContent, /tax savings are not calculated/i);
});

test("wealth product preset creates a typed asset and exports its subtype and birth date", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;

  document.getElementById("birthDate").value = "1990-01-15";
  document.getElementById("assetType").value = "wealth";
  dispatch(dom, document.getElementById("assetType"), "change");
  document.getElementById("wealthProduct").value = "ruerup";
  dispatch(dom, document.getElementById("wealthProduct"), "change");

  assert.equal(document.getElementById("assetRate").value, "4");
  assert.equal(document.getElementById("assetName").value, "Rürup");

  document.getElementById("assetForm").dispatchEvent(
    new dom.window.Event("submit", { bubbles: true, cancelable: true }),
  );
  const card = [...document.querySelectorAll(".asset-card")].find((item) =>
    item.querySelector(".asset-type").textContent.includes("Rürup"),
  );
  assert.ok(card);
  assert.match(card.querySelector(".wealth-treatment").textContent, /tax savings are not calculated/i);

  document.getElementById("showYaml").click();
  const yaml = document.getElementById("yamlOutput").value;
  assert.match(yaml, /birthDate: "1990-01-15"/);
  assert.match(yaml, /subtype: ruerup/);
});

test("switching to a wealth preset keeps a custom asset name", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;

  document.getElementById("assetType").value = "wealth";
  dispatch(dom, document.getElementById("assetType"), "change");
  document.getElementById("assetName").value = "My retirement account";
  document.getElementById("wealthProduct").value = "av-depot";
  dispatch(dom, document.getElementById("wealthProduct"), "change");

  assert.equal(document.getElementById("assetName").value, "My retirement account");
  assert.equal(document.getElementById("wealthProductControl").hidden, false);
});

test("wealth labels and benefit descriptions follow the selected language", (t) => {
  const dom = createApp();
  t.after(() => dom.window.close());
  const { document } = dom.window;

  document.getElementById("assetType").value = "wealth";
  dispatch(dom, document.getElementById("assetType"), "change");
  document.getElementById("wealthProduct").value = "etf-portfolio";
  dispatch(dom, document.getElementById("wealthProduct"), "change");
  document.getElementById("languageSwitch").value = "de";
  dispatch(dom, document.getElementById("languageSwitch"), "change");

  assert.equal(document.getElementById("wealthProduct").selectedOptions[0].textContent, "ETF-Portfolio");
  assert.match(document.getElementById("wealthProductNote").textContent, /Steuerersparnis werden nicht berechnet/);
});
