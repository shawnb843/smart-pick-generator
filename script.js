function analyze() {
  const raw = document.getElementById("history").value.trim();
  const lines = raw.split(/\n+/);
  const draws = lines.map(l => l.match(/\d{3,5}/g)).filter(Boolean);
  let positionFreq = [{}, {}, {}, {}, {}];
  draws.forEach(draw => {
    const nums = draw[0].split('').map(Number);
    nums.forEach((d, i) => {
      if (!positionFreq[i]) positionFreq[i] = {};
      positionFreq[i][d] = (positionFreq[i][d] || 0) + 1;
    });
  });
  let output = '<h3>📊 Position Frequency</h3>';
  positionFreq.forEach((pos, i) => {
    output += `Pos ${i+1}: `;
    for (let d in pos) {
      output += `${d}(${pos[d]}) `;
    }
    output += '<br>';
  });
  document.getElementById("results").innerHTML = output;
}