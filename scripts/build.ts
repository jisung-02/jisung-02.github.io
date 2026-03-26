import { execSync } from "node:child_process";
import { copyFile, cp, mkdir, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticDirectory = path.join(rootDirectory, "static");
const staticAssetsDirectory = path.join(rootDirectory, "static", "assets");

async function main(): Promise<void> {
  const temporaryAssetsDirectory = path.join(staticDirectory, `.assets-tmp-${Date.now()}`);
  await rm(temporaryAssetsDirectory, { recursive: true, force: true });
  await mkdir(temporaryAssetsDirectory, { recursive: true });

  await copyFile(path.join(rootDirectory, "src", "assets", "styles.css"), path.join(temporaryAssetsDirectory, "styles.css"));

  await rm(staticAssetsDirectory, { recursive: true, force: true });
  await rename(temporaryAssetsDirectory, staticAssetsDirectory);

  try {
    execSync("hugo --cleanDestinationDir --minify", {
      cwd: rootDirectory,
      stdio: "inherit",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Hugo build failed. Ensure \`hugo\` is installed and available in PATH. ${message}`);
  }

  await createLocalPreviewMirror(path.join(rootDirectory, "dist"));
  console.log("build ok: dist generated");
}

async function createLocalPreviewMirror(distDirectory: string): Promise<void> {
  const previewDirectory = path.join(distDirectory, "blog");
  await rm(previewDirectory, { recursive: true, force: true });
  await mkdir(previewDirectory, { recursive: true });

  const entries = await readdir(distDirectory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === "blog") {
      continue;
    }

    await cp(path.join(distDirectory, entry.name), path.join(previewDirectory, entry.name), {
      recursive: true,
      force: true,
      errorOnExist: false,
    });
  }
}

void main();
