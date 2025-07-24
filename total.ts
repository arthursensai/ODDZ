import fs from 'fs';
import path from 'path';

const targetExtensions = ['.ts', '.tsx', '.js', '.jsx'];
const ignoreDirs = ['node_modules', '.next'];
const ignoreFiles = ['package-lock.json'];

let totalLines = 0;
let totalFiles = 0;

function countLinesInFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

function scanDirectory(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (!ignoreDirs.includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (
      targetExtensions.includes(path.extname(fullPath)) &&
      !ignoreFiles.includes(path.basename(fullPath))
    ) {
      totalLines += countLinesInFile(fullPath);
      totalFiles++;
    }
  }
}

scanDirectory(process.cwd());

console.log(`✅ Total lines of code: ${totalLines}`);
console.log(`📁 Files counted: ${totalFiles}`);
