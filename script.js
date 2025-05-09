function generateCombo() {
  const pick = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  document.getElementById("comboOutput").innerText = `🔮 Suggested Combo: ${pick}`;
}

const watchlist = [];

function addToWatchlist() {
  const input = document.getElementById("watchInput").value.trim();
  if (!/^\d{3,5}$/.test(input)) {
    alert("Please enter a 3–5 digit combo.");
    return;
  }
  watchlist.push(input);
  document.getElementById("watchlist").innerHTML = "📌 Watchlist:<br>" + watchlist.join("<br>");
}

window.onload = function () {
  new Chart(document.getElementById("sumChart"), {
    type: 'bar',
    data: {
      labels: Array.from({length: 45}, (_, i) => i),
      datasets: [{ label: 'Sum Frequency (Mock)', data: Array.from({length: 45}, () => Math.floor(Math.random() * 10)) }]
    }
  });

  new Chart(document.getElementById("digitHeatmap"), {
    type: 'bar',
    data: {
      labels: ['Pos 1', 'Pos 2', 'Pos 3', 'Pos 4', 'Pos 5'],
      datasets: Array.from({ length: 10 }, (_, d) => ({
        label: `Digit ${d}`,
        data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 10))
      }))
    }
  });
}