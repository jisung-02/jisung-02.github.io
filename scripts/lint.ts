import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetDirectories = ["src", "scripts", "tests", "content", "layouts"];
const fileExtensions = new Set([".ts", ".tsx", ".md", ".html", ".css", ".toml"]);

async function main(): Promise<void> {
  const files = await collectLintTargets();
  const failures: string[] = [];

  for (const filePath of files) {
    const raw = await readFile(filePath, "utf8");
    const lines = raw.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (/[ \t]+$/.test(line)) {
        failures.push(`${relative(filePath)}:${index + 1} trailing whitespace`);
      }

      if (/\t/.test(line)) {
        failures.push(`${relative(filePath)}:${index + 1} tab indentation is not allowed`);
      }

      if (line.length > 140) {
        failures.push(`${relative(filePath)}:${index + 1} line is longer than 140 chars`);
      }
    });

    const relativePath = relative(filePath);
    const isSourceCode = relativePath.startsWith("src/");
    if (isSourceCode && (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) && raw.includes("console.log(")) {
      failures.push(`${relativePath} contains console.log`);
    }
  }

  if (failures.length > 0) {
    console.error("\nLint failed:\n");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log(`lint ok: ${files.length} files checked`);
}

async function collectLintTargets(): Promise<string[]> {
  const files: string[] = [];

  for (const directory of targetDirectories) {
    const absoluteDirectory = path.join(rootDirectory, directory);
    files.push(...(await collectFilesRecursively(absoluteDirectory)));
  }

  return files;
}

async function collectFilesRecursively(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFilesRecursively(fullPath)));
      continue;
    }

    if (entry.isFile() && fileExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function relative(filePath: string): string {
  return path.relative(rootDirectory, filePath);
}

void main();
