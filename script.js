function analyze() {
  const raw = document.getElementById("history").value.trim();
  localStorage.setItem("drawHistory", raw);
  const lines = raw.split(/\n+/).filter(Boolean);
  const drawData = [];
  let currentDate = null;
  let results = "<h3>Combo Evolution Tracker</h3>";

  lines.forEach((line, i) => {
    const dateMatch = line.match(/(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s+(\w+\s+\d{1,2},\s+\d{4})/);
    if (dateMatch) {
      currentDate = new Date(dateMatch[2]);
      return;
    }
    const numMatch = line.match(/\d{3,5}/);
    if (!numMatch || !currentDate) return;
    const digits = numMatch[0].split('').map(Number);
    const sum = digits.reduce((a,b)=>a+b, 0);
    const dateStr = currentDate.toLocaleDateString();
    drawData.push({ digits, sum, date: dateStr });

    results += `Draw ${i+1}: ${digits.join("")} | Sum: ${sum} | Date: ${dateStr}<br>`;
  });

  localStorage.setItem("drawJSON", JSON.stringify(drawData));
  document.getElementById("results").innerHTML = results;
}

function testFilters() {
  const requiredDigit = document.getElementById("filterDigit").value;
  const requiredSum = parseInt(document.getElementById("filterSum").value);
  const data = JSON.parse(localStorage.getItem("drawJSON") || "[]");
  let hits = 0;

  data.forEach(entry => {
    const matchDigit = requiredDigit ? entry.digits.includes(parseInt(requiredDigit)) : true;
    const matchSum = requiredSum ? entry.sum === requiredSum : true;
    if (matchDigit && matchSum) hits++;
  });

  document.getElementById("filterResults").innerText = `Hits: ${hits} of ${data.length} draws matched filters.`;
}

function downloadCSV() {
  const data = JSON.parse(localStorage.getItem("drawJSON") || "[]");
  const csvRows = ["Date,Combo,Sum"];
  data.forEach(entry => {
    csvRows.push(`${entry.date},${entry.digits.join("")},${entry.sum}`);
  });
  const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "draw_history.csv";
  link.click();
}