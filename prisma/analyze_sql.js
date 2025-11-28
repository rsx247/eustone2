
const fs = require('fs');

const SQL_FILE = "/Users/admin/Documents/EUSTONE/Cursor/Products Scraper/1. USER MASTER/Full Live Database Export SQL 20102025-1113.sql";

function analyze() {
  const content = fs.readFileSync(SQL_FILE, 'utf-8');
  const lines = content.split('\n');
  
  const insertLine = lines.find(l => l.startsWith("INSERT INTO `products`"));
  if (!insertLine) return console.log("No insert line found");

  // Extract column names
  const match = insertLine.match(/INSERT INTO `products` \((.*?)\) VALUES/);
  if (!match) return;

  const columns = match[1].split(', ').map(s => s.replace(/`/g, ''));
  
  console.log("Column Mapping:");
  columns.forEach((col, i) => console.log(`${i}: ${col}`));

  // Extract first value set to verify
  // This is tricky because of the massive single line. We'll just assume standard SQL dumping format.
}

analyze();



