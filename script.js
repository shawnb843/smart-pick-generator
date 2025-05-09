function viewNearMiss() {
  const input = document.getElementById("comboInput").value;
  if (!/^\d{3,5}$/.test(input)) {
    alert("Enter a 3–5 digit combo.");
    return;
  }
  document.getElementById("nearMissOutput").innerText = `✅ Near-miss report for ${input} (mock result).`;
}

function analyzeMatrix() {
  const combo = document.getElementById("vCombo").value;
  if (!/^\d{3,5}$/.test(combo)) {
    alert("Enter a 3–5 digit combo.");
    return;
  }
  const digits = combo.split('').map(Number);
  const mirrors = digits.map(d => (d + 5) % 10);
  const vtracs = digits.map(d => Math.floor(d / 2));
  document.getElementById("matrixResults").innerHTML = `
    <strong>Original:</strong> ${combo}<br>
    <strong>Mirror:</strong> ${mirrors.join("")}<br>
    <strong>VTRAC:</strong> ${vtracs.join("")}
  `;
}

window.onload = () => {
  document.getElementById("hotPatterns").innerText = "Mock: Sums 25, 28 trending over 5 draws.";
  document.getElementById("timingTrends").innerText = "Mock: Midday draws favor digits 3, 7. Evening prefers 2, 6.";
  document.getElementById("streaks").innerText = "Mock: Digit 9 hit 3 times in a row.";
  document.getElementById("misses").innerText = "Mock: Sum 12 has not appeared in 40 draws.";
}