function analyze() {
  const raw = document.getElementById("history").value.trim();
  const lines = raw.split(/\n+/).filter(Boolean);
  const drawData = [];
  const weekdaySums = {};
  const sumCycles = {};
  const now = new Date();

  lines.forEach(line => {
    const parts = line.split(/\t|\s{2,}/).filter(Boolean);
    const dateMatch = line.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/);
    const digits = line.match(/\d{3,5}/g);
    if (!digits) return;
    const nums = digits[0].split('').map(Number);
    const sum = nums.reduce((a,b) => a + b, 0);
    const date = dateMatch ? new Date(dateMatch[0]) : null;
    const day = date ? date.toLocaleDateString('en-US', { weekday: 'long' }) : "Unknown";

    if (!weekdaySums[day]) weekdaySums[day] = {};
    weekdaySums[day][sum] = (weekdaySums[day][sum] || 0) + 1;

    drawData.push({ day, sum, digits: nums });
  });

  // Position frequency
  const posFreq = [{},{},{},{},{}];
  drawData.forEach(({digits}) => {
    digits.forEach((d, i) => {
      posFreq[i][d] = (posFreq[i][d] || 0) + 1;
    });
  });

  // Sum cycle tracker
  const cycleTracker = {};
  let result = "<h3>📊 Digit Position Frequency</h3>";
  posFreq.forEach((map, i) => {
    result += `Pos ${i+1}: `;
    for (let d in map) result += `${d}(${map[d]}) `;
    result += "<br>";
  });

  result += "<h3>🗓️ Sum Patterns by Day of Week</h3>";
  for (let day in weekdaySums) {
    result += `<b>${day}</b>: `;
    for (let s in weekdaySums[day]) result += `Sum ${s}(${weekdaySums[day][s]}) `;
    result += "<br>";
  }

  result += "<h3>🔁 Sum Cycle Estimates (by draw index)</h3>";
  const seenSums = {};
  drawData.forEach((entry, i) => {
    if (seenSums[entry.sum] !== undefined) {
      const gap = i - seenSums[entry.sum];
      if (!sumCycles[entry.sum]) sumCycles[entry.sum] = [];
      sumCycles[entry.sum].push(gap);
    }
    seenSums[entry.sum] = i;
  });

  for (let s in sumCycles) {
    const avg = sumCycles[s].reduce((a,b)=>a+b,0)/sumCycles[s].length;
    result += `Sum ${s} → Avg Cycle: ${avg.toFixed(1)} draws<br>`;
  }

  document.getElementById("results").innerHTML = result;
}