function analyze() {
  const history = document.getElementById("history").value.trim();
  const gameType = parseInt(document.getElementById("gameType").value);
  const allowRepeats = document.getElementById("allowRepeats").checked;
  const minSum = parseInt(document.getElementById("minSum").value);
  const maxSum = parseInt(document.getElementById("maxSum").value);
  const includeDigits = document.getElementById("includeDigits").value.split(',').map(d => d.trim()).filter(Boolean);
  const excludeDigits = document.getElementById("excludeDigits").value.split(',').map(d => d.trim()).filter(Boolean);

  const lines = history.split(/\n+/).filter(l => l.trim().match(/\d{3,5}/));
  const numbers = lines.map(l => {
    const match = l.match(/\d{3,5}/g);
    return match ? match[0].split('').map(Number) : null;
  }).filter(Boolean).filter(d => d.length === gameType);

  const sumMap = {}, pairMap = {}, digitFreq = {};
  numbers.forEach(digits => {
    const sum = digits.reduce((a,b)=>a+b, 0);
    sumMap[sum] = (sumMap[sum] || 0) + 1;
    digits.forEach(d => digitFreq[d] = (digitFreq[d] || 0) + 1);
    for (let i=0; i<digits.length-1; i++) {
      const pair = `${digits[i]}${digits[i+1]}`;
      pairMap[pair] = (pairMap[pair] || 0) + 1;
    }
  });

  const allSums = Object.entries(sumMap).map(([s, f]) => ({sum: parseInt(s), freq: f}));
  const hotSums = allSums.sort((a,b)=>b.freq - a.freq).slice(0, 3).map(e => e.sum);
  const bustSums = allSums.sort((a,b)=>a.freq - b.freq).slice(0, 3).map(e => e.sum);

  const allPairs = Object.entries(pairMap).map(([p, f]) => ({pair: p, freq: f}));
  const hotPairs = allPairs.sort((a,b)=>b.freq - a.freq).slice(0, 5).map(e => e.pair);
  const bustPairs = allPairs.sort((a,b)=>a.freq - b.freq).slice(0, 5).map(e => e.pair);

  let picks = [], tried = new Set();
  while (picks.length < 5 && tried.size < 10000) {
    let pick = Array.from({length: gameType}, () => crypto.getRandomValues(new Uint32Array(1))[0] % 10);
    let sum = pick.reduce((a,b)=>a+b, 0);
    let combo = pick.join("");
    if (!allowRepeats && new Set(pick).size !== pick.length) continue;
    if (sum < minSum || sum > maxSum) continue;
    if (includeDigits.some(d => !combo.includes(d))) continue;
    if (excludeDigits.some(d => combo.includes(d))) continue;
    picks.push(combo);
    tried.add(combo);
  }

  document.getElementById("results").innerHTML = `
    <strong>🔥 Hot Sums:</strong> ${hotSums.join(", ")}<br>
    <strong>🧊 Bust Sums:</strong> ${bustSums.join(", ")}<br>
    <strong>🔥 Hot Pairs:</strong> ${hotPairs.join(", ")}<br>
    <strong>🧊 Bust Pairs:</strong> ${bustPairs.join(", ")}<br><br>
    <strong>🎯 Smart Picks (Filtered):</strong><br>${picks.join("<br>")}
  `;
}