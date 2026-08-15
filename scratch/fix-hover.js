const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "../src");

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith(".tsx")) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const tsxFiles = walkSync(SRC_DIR);
let changedCount = 0;

tsxFiles.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  let original = content;

  // Fix 1: dark:text-zinc-100 where it should be dark:hover:text-zinc-100 (in Link and ThemeToggle)
  // The QA noted: "Enlace Back to Hub ... text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100"
  content = content.replace(/hover:text-zinc-900 dark:text-zinc-100/g, "hover:text-zinc-900 dark:hover:text-zinc-100");

  // Fix 2: dark:bg-zinc-800 instead of dark:hover:bg-zinc-800 (Practice Mode, ThemeToggle, SearchBar autocomplete)
  // QA noted: "... bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:bg-zinc-800"
  // Let's find hover:bg-zinc-100 dark:bg-zinc-800
  content = content.replace(/hover:bg-zinc-100 dark:bg-zinc-800/g, "hover:bg-zinc-100 dark:hover:bg-zinc-800");
  
  // Fix 3: hover:bg-zinc-100 dark:bg-zinc-800/80 (Tier and Software cards)
  content = content.replace(/hover:bg-zinc-100 dark:bg-zinc-800\/80/g, "hover:bg-zinc-100 dark:hover:bg-zinc-800/80");

  // Fix 4: hover:text-white hover:bg-zinc-100 dark:bg-zinc-800 (Leaderboard close button)
  content = content.replace(/hover:text-white hover:bg-zinc-100 dark:bg-zinc-800/g, "hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800");

  // Fix 5: hover:bg-zinc-50 dark:bg-zinc-900/50 (Leaderboard rows)
  content = content.replace(/hover:bg-zinc-50 dark:bg-zinc-900\/50/g, "hover:bg-zinc-50 dark:hover:bg-zinc-800/50");

  // Custom SearchBar Autocomplete elements: "... hover:bg-zinc-100 dark:bg-zinc-800 ..."
  // Handled by Fix 2!

  // Custom KofiButton: wait, I didn't see if kofi was broken but I can check if it had `hover:bg-zinc-100`

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Fixed hovers in: ${path.relative(SRC_DIR, file)}`);
    changedCount++;
  }
});

console.log(`\nDone! Fixed hovers in ${changedCount} files.`);
