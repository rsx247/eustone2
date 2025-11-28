const fs = require('fs');
const FILE = "/Users/admin/Documents/EUSTONE/Cursor/Products Scraper/1. USER MASTER/master_products_database_cleaned.sql";

const content = fs.readFileSync(FILE, 'utf-8');
const insertLine = content.split('\n').find(l => l.startsWith("INSERT INTO `products`"));
if (insertLine) {
    console.log("VALUES START:", insertLine.substring(insertLine.indexOf('VALUES') + 6, insertLine.indexOf('VALUES') + 200));
} else {
    console.log("No INSERT line found");
}



