// vlb-subscription-calculator.js

// ---- Helpers ----
const formatNumberDE = (n) => {
    // 12.345,67 (de-DE)
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
};

const readBaseNew = (rangeEl) => {
    const opt = rangeEl?.selectedOptions?.[0];
    const raw = opt?.dataset?.price ?? '0';
    const val = Number(raw);
    return Number.isFinite(val) ? val : 0;
};

const readDiscountPct = (component) => {
    const raw = component?.dataset?.discountPct ?? '0';
    // akzeptiert "10" oder "10,5"
    const pct = Number(String(raw).replace(',', '.'));
    return Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0;
};


// ---- Core calculation & UI update ----
const recalc = (component) => {
    const rangeEl         = component.querySelector('[data-component-part="vlb-subscription-calculator.range"]');
    const outTotalNewEl   = component.querySelector('[data-component-part="vlb-subscription-calculator.total-new"]');
    const outDiscEl       = component.querySelector('[data-component-part="vlb-subscription-calculator.total-discount"]'); // optional
    const hiddenTotalEl   = component.querySelector('[data-component-part="vlb-subscription-calculator.hidden-total"]');   // optional

    if (!rangeEl || !outTotalNewEl) return;

    const price       = readBaseNew(rangeEl);
    const discountPct = readDiscountPct(component);

    const yearlyBefore = price;
    const yearlyAfter  = price * (1 - discountPct / 100);

    outTotalNewEl.textContent = formatNumberDE(yearlyBefore);

    if (outDiscEl && discountPct > 0) {
        outDiscEl.textContent = formatNumberDE(yearlyAfter);
    }

    // Hidden-Feld: wie im Altcode — wenn Discount > 0, nimm die rabattierte Summe
    if (hiddenTotalEl) {
        hiddenTotalEl.setAttribute('value', formatNumberDE(discountPct > 0 ? yearlyAfter : yearlyBefore));
    }
};

// ---- Init (component-scoped) ----
const initCalculator = (component) => {
    const rangeEl = component.querySelector('[data-component-part="vlb-subscription-calculator.range"]');

    if (!rangeEl) return;

    rangeEl.addEventListener('change', () => recalc(component));

    recalc(component);
};

// ---- Init all ----
const initCalculators = () => {
    document
        .querySelectorAll('[data-component="molecules.vlb-subscription-calculator"]')
        .forEach((component) => initCalculator(component));
};

export default initCalculators;