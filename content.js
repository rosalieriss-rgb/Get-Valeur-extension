// content.js
// Simple Get Valeur demo overlay for eBay listings.
// Reads the current price from the page, fabricates demo comps & resale,
// and injects a branded panel on the right.

(function () {
  // Avoid injecting twice
  if (document.getElementById("get-valeur-panel")) return;

  // --- 1. Try to read the current listing price from the page ---

  function parsePriceFromText(text) {
    if (!text) return null;
    // Replace commas with dots if needed and strip non-digits except dot
    const cleaned = text.replace(/\s/g, "").replace(",", ".");
    const match = cleaned.match(/(\d+(\.\d{1,2})?)/);
    if (!match) return null;
    return parseFloat(match[1]);
  }

  function getCurrencySymbol(text) {
    if (!text) return "€";
    if (text.includes("$")) return "$";
    if (text.includes("£")) return "£";
    if (text.includes("¥") || text.includes("円")) return "¥";
    if (text.includes("CHF")) return "CHF";
    if (text.includes("€")) return "€";
    return "€";
  }

  function findPriceElement() {
    // Try several common selectors on eBay
    const candidates = [
      '[itemprop="price"]',
      '.x-price-primary',                // new layout
      '#prcIsum',                        // old Buy It Now
      '#mm-saleDscPrc',                  // sale price
      '.notranslate[data-testid="x-item-price"]',
      '.x-bin-price__content span',
    ];

    for (const selector of candidates) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) return el;
    }

    return null;
  }

  const priceEl = findPriceElement();
  const rawPriceText = priceEl ? priceEl.textContent.trim() : "";
  const currentPrice = parsePriceFromText(rawPriceText) || null;
  const currencySymbol = getCurrencySymbol(rawPriceText);

  // --- 2. Fabricate demo comps & estimated resale based on the price ---

  let comparableSales = [];
  let estimatedResale = null;
  let dealQuality = "N/A";
  let dealColor = "#e5e7eb"; // default grey

  if (currentPrice) {
    // Simple placeholders: comps = 80/85/90% of current price
    const c1 = Math.round(currentPrice * 0.8);
    const c2 = Math.round(currentPrice * 0.85);
    const c3 = Math.round(currentPrice * 0.9);
    comparableSales = [c1, c2, c3];

    // Use their average as "estimated resale"
    estimatedResale = Math.round((c1 + c2 + c3) / 3);

    const ratio = currentPrice / estimatedResale;

    if (ratio <= 0.9) {
      dealQuality = "Great deal";
      dealColor = "#22c55e"; // green
    } else if (ratio > 0.9 && ratio <= 1.1) {
      dealQuality = "Fair";
      dealColor = "#eab308"; // amber
    } else {
      dealQuality = "Overpriced";
      dealColor = "#f97373"; // soft red
    }
  }

  // --- 3. Create the overlay container ---

  const panel = document.createElement("div");
  panel.id = "get-valeur-panel";

  // Basic HTML structure
  panel.innerHTML = `
    <div class="gv-header">
      <div class="gv-logo-circle">
        <span class="gv-logo-text">V</span>
      </div>
      <div class="gv-header-text">
        <div class="gv-title">Valeur Insights</div>
        <div class="gv-subtitle">Demo resale view for luxury bags</div>
      </div>
    </div>

    <div class="gv-section">
      <div class="gv-section-label">Deal quality</div>
      <div class="gv-deal-value" style="color:${dealColor}">${dealQuality}</div>
      ${
        currentPrice
          ? `<div class="gv-deal-price">Current price: <span>${currencySymbol}${currentPrice.toLocaleString()}</span></div>`
          : `<div class="gv-deal-price gv-muted">Current price not detected — demo values only.</div>`
      }
      <div class="gv-hint">Real scoring will use historical sales from eBay.</div>
    </div>

    <div class="gv-section">
      <div class="gv-section-label">Comparable sales (demo)</div>
      ${
        comparableSales.length
          ? `
      <ul class="gv-list">
        <li>${currencySymbol}${comparableSales[0].toLocaleString()}</li>
        <li>${currencySymbol}${comparableSales[1].toLocaleString()}</li>
        <li>${currencySymbol}${comparableSales[2].toLocaleString()}</li>
      </ul>`
          : `<div class="gv-muted">No price detected, showing placeholders soon.</div>`
      }
    </div>

    <div class="gv-section">
      <div class="gv-section-label">Estimated resale (demo)</div>
      ${
        estimatedResale
          ? `<div class="gv-resale-value">${currencySymbol}${estimatedResale.toLocaleString()}</div>`
          : `<div class="gv-muted">Resale estimate will appear once we have real sales data.</div>`
      }
      <div class="gv-hint">Final version will be based on real sales, fees & condition.</div>
    </div>

    <div class="gv-footer">
      Powered by <span class="gv-brand">Get Valeur</span>
    </div>
  `;

  document.body.appendChild(panel);
})();
