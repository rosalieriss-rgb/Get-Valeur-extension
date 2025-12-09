console.log("Get Valeur extension loaded");

// --- Prevent duplicate panels ---
if (document.getElementById("getvaleur-panel")) {
  console.log("Panel already exists");
} else {
  // Create a container
  const panel = document.createElement("div");
  panel.id = "getvaleur-panel";

  panel.innerHTML = `
    <h2 class="gv-title">Valeur Insights</h2>
    
    <div class="gv-section">
      <div class="gv-label">Deal Quality</div>
      <div class="gv-value gv-good">Fair</div>
    </div>

    <div class="gv-section">
      <div class="gv-label">Comparable Sales (90 days)</div>
      <div class="gv-list">
        <div>€1,775</div>
        <div>€1,900</div>
        <div>€1,825</div>
      </div>
    </div>

    <div class="gv-section">
      <div class="gv-label">Estimated Resale Value</div>
      <div class="gv-value">€1,850</div>
    </div>

    <div class="gv-footer">Powered by Get Valeur</div>
  `;

  // Inject in page (right side)
  document.body.appendChild(panel);
}
