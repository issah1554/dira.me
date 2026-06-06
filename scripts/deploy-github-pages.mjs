import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const branch = "gh-pages";
const deployDir = ".deploy-gh-pages";

const run = (command, args, options = {}) => {
  if (process.platform === "win32" && command === "npm") {
    execFileSync("cmd.exe", ["/c", command, ...args], {
      stdio: "inherit",
      ...options,
    });
    return;
  }

  execFileSync(command, args, { stdio: "inherit", ...options });
};

const originUrl = execFileSync("git", ["remote", "get-url", "origin"], {
  encoding: "utf8",
}).trim();

run("npm", ["run", "build:pages"]);

await rm(deployDir, { recursive: true, force: true });
await mkdir(deployDir, { recursive: true });
await cp("dist", deployDir, { recursive: true });
await writeFile(join(deployDir, ".nojekyll"), "");

run("git", ["init"], { cwd: deployDir });
run("git", ["checkout", "-b", branch], { cwd: deployDir });
run("git", ["remote", "add", "origin", originUrl], { cwd: deployDir });
run("git", ["add", "."], { cwd: deployDir });
run("git", ["commit", "-m", "Deploy GitHub Pages"], { cwd: deployDir });
run("git", ["push", "--force", "origin", branch], { cwd: deployDir });

await rm(deployDir, { recursive: true, force: true });
