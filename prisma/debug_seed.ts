import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();
const SQL_FILE = "/Users/admin/Documents/EUSTONE/Cursor/Products Scraper/1. USER MASTER/Full Live Database Export SQL 20102025-1113.sql";

async function main() {
  const content = fs.readFileSync(SQL_FILE, 'utf-8');
  const insertLine = content.split('\n').find(l => l.startsWith("INSERT INTO `products`"));
  
  if (insertLine) {
      const valuesPart = insertLine.substring(insertLine.indexOf('VALUES') + 6).trim();
      console.log("First 200 chars of VALUES:", valuesPart.substring(0, 200));
      
      // Try a simpler split
      const rows = valuesPart.split('),('); 
      console.log("Split by '),(': ", rows.length);
  }
}

main();



