// vlb-subscription-calculator.js

// ---- Helpers ----
const formatNumberDE = (n) => {
    // 12.345,67 (de-DE)
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
};

const readBaseNew = (rangeEl) => {
    const opt = rangeEl?.selectedOptions?.[0];
    const raw = opt?.dataset?.baseNew ?? '0';
    const val = Number(raw);
    return Number.isFinite(val) ? val : 0;
};

const readDiscountPct = (component) => {
    const raw = component?.dataset?.discountPct ?? '0';
    // akzeptiert "10" oder "10,5"
    const pct = Number(String(raw).replace(',', '.'));
    return Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0;
};

const readAddonSum = (addons) => {
    return addons.reduce((sum, el) => {
        if (!el) return sum;
        if (el.type === 'checkbox') {
            const feeChecked = Number(el.dataset.feeChecked ?? '0');
            const feeUnchecked = Number(el.dataset.feeUnchecked ?? '0');
            const fee = el.checked ? feeChecked : feeUnchecked;
            return sum + (Number.isFinite(fee) ? fee : 0);
        }
        const fee = Number(el.dataset.fee ?? '0');
        return sum + (Number.isFinite(fee) ? fee : 0);
    }, 0);
};

// ---- Core calculation & UI update ----
const recalc = (component) => {
    const rangeEl         = component.querySelector('[data-component-part="vlb-subscription-calculator.range"]');
    const outTotalNewEl   = component.querySelector('[data-component-part="vlb-subscription-calculator.total-new"]');
    const outDiscEl       = component.querySelector('[data-component-part="vlb-subscription-calculator.total-discount"]'); // optional
    const hiddenTotalEl   = component.querySelector('[data-component-part="vlb-subscription-calculator.hidden-total"]');   // optional

    const addonEls = [
        component.querySelector('[data-component-part="vlb-subscription-calculator.ftp"]'),
        // weitere Addons könnten hier ergänzt werden
    ].filter(Boolean);

    if (!rangeEl || !outTotalNewEl) return;

    const baseNew     = readBaseNew(rangeEl);   // Jahrespreis
    const addonsSum   = readAddonSum(addonEls); // ebenfalls Jahrespreise
    const discountPct = readDiscountPct(component);

    const yearlyBefore = baseNew + addonsSum;
    const yearlyAfter  = (baseNew * (1 - discountPct / 100)) + addonsSum;

    // immer ohne Rabatt ausgeben
    outTotalNewEl.textContent = formatNumberDE(yearlyBefore);

    // nur ausgeben, wenn ein Discount-Element existiert UND discountPct > 0
    if (outDiscEl) {
        if (discountPct > 0) {
            outDiscEl.textContent = formatNumberDE(yearlyAfter);
            outDiscEl.closest('[data-component-part="vlb-subscription-calculator.discount-row"]')?.classList.remove('hidden');
        } else {
            // verstecken, falls vorhanden
            outDiscEl.closest('[data-component-part="vlb-subscription-calculator.discount-row"]')?.classList.add('hidden');
        }
    }

    // Hidden-Feld: wie im Altcode — wenn Discount > 0, nimm die rabattierte Summe
    if (hiddenTotalEl) {
        hiddenTotalEl.setAttribute('value', formatNumberDE(discountPct > 0 ? yearlyAfter : yearlyBefore));
    }
};

// ---- Init (component-scoped) ----
const initCalculator = (component) => {
    const rangeEl = component.querySelector('[data-component-part="vlb-subscription-calculator.range"]');
    const ftpEl   = component.querySelector('[data-component-part="vlb-subscription-calculator.ftp"]');

    if (!rangeEl) return;

    rangeEl.addEventListener('change', () => recalc(component));
    if (ftpEl) ftpEl.addEventListener('change', () => recalc(component));

    // Initialberechnung
    recalc(component);
};

// ---- Init all ----
const initCalculators = () => {
    document
        .querySelectorAll('[data-component="molecules.vlb-subscription-calculator"]')
        .forEach((component) => initCalculator(component));
};

export default initCalculators;