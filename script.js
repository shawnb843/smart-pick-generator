let allNumbers = [], watchlist = [];

function analyze() {
  const input = document.getElementById("history").value;
  const allowRepeats = document.getElementById("allowRepeats").checked;
  const gameType = parseInt(document.getElementById("gameType").value);
  const lines = input.split(/\n+/).filter(l => l.trim().match(/\d{3,5}/));
  allNumbers = lines.map(l => {
    const match = l.match(/\d{3,5}/g);
    return match ? match[0].split('').map(Number) : null;
  }).filter(Boolean).filter(d => d.length === gameType);

  const sumFreq = {}, digitFreq = {}, pairFreq = {}, sumOrder = [];
  allNumbers.forEach((d) => {
    const s = d.reduce((a,b) => a+b, 0);
    sumFreq[s] = (sumFreq[s] || 0) + 1;
    sumOrder.push(s);
    d.forEach(n => digitFreq[n] = (digitFreq[n] || 0) + 1);
    for (let i=0; i<d.length-1; i++) {
      const pair = `${d[i]}${d[i+1]}`;
      pairFreq[pair] = (pairFreq[pair] || 0) + 1;
    }
  });

  const topSums = Object.entries(sumFreq).sort((a,b)=>b[1]-a[1]).slice(0,3).map(e=>+e[0]);
  const hotDigits = Object.entries(digitFreq).sort((a,b)=>b[1]-a[1]).slice(0,5).map(e=>+e[0]);
  const hotPairs = Object.entries(pairFreq).sort((a,b)=>b[1]-a[1]).slice(0,10).map(e=>e[0]);

  const recentSums = sumOrder.slice(-10);
  const overdueSums = Object.keys(sumFreq).map(Number).filter(s => !recentSums.includes(s)).slice(0, 5);
  const recentPairs = new Set();
  allNumbers.slice(-10).forEach(d => {
    for (let i=0; i<d.length-1; i++) recentPairs.add(`${d[i]}${d[i+1]}`);
  });
  const overduePairs = Object.keys(pairFreq).filter(p => !recentPairs.has(p)).slice(0,10);

  let picks = [], tried = new Set();
  while (picks.length < 5 && tried.size < 10000) {
    let pick = Array.from({length: gameType}, () => crypto.getRandomValues(new Uint32Array(1))[0] % 10);
    if (!allowRepeats && new Set(pick).size !== pick.length) continue;
    let score = 0;
    let s = pick.reduce((a,b)=>a+b, 0);
    if (topSums.includes(s)) score += 30;
    pick.forEach(d => { if (hotDigits.includes(d)) score += 5; });
    for (let i=0; i<pick.length-1; i++) {
      if (hotPairs.includes(`${pick[i]}${pick[i+1]}`)) score += 10;
    }
    picks.push({combo: pick.join(""), score});
    tried.add(pick.join(""));
  }

  const list = picks.map(c =>
    `Combo: ${c.combo} → Score: ${c.score} <button onclick="addToWatchlist('${c.combo}')">⭐ Save</button>`
  ).join("<br>");

  document.getElementById("results").innerHTML = `
    <strong>Overdue Sums:</strong> ${overdueSums.join(", ")}<br>
    <strong>Overdue Pairs:</strong> ${overduePairs.join(", ")}<br><br>
    <strong>🔥 Smart Picks:</strong><br>${list}`;
  loadWatchlist();
}

function runSimulation() {
  const count = parseInt(document.getElementById("simCount").value);
  const gameType = parseInt(document.getElementById("gameType").value);
  let hits = 0;
  for (let i = 0; i < count; i++) {
    let pick = Array.from({length: gameType}, () => Math.floor(Math.random() * 10)).join("");
    if (watchlist.includes(pick)) hits++;
  }
  const percent = ((hits / count) * 100).toFixed(2);
  document.getElementById("results").innerHTML += `<br><br>🎲 Simulation: ${hits} hits / ${count} draws<br>Hit Rate: ${percent}%`;
}

function loadWatchlist() {
  watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
  document.getElementById("watchlist").innerHTML = watchlist.length
    ? watchlist.map(w => `<div class="watch-item">${w} <button onclick="removeFromWatchlist('${w}')">❌</button></div>`).join("")
    : "No saved combos.";
}

function addToWatchlist(combo) {
  if (!watchlist.includes(combo)) {
    watchlist.push(combo);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    loadWatchlist();
  }
}

function removeFromWatchlist(combo) {
  watchlist = watchlist.filter(c => c !== combo);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  loadWatchlist();
}

window.onload = loadWatchlist;
