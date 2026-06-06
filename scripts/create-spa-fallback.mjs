import { copyFile } from "node:fs/promises";
import { join } from "node:path";

await copyFile(join("dist", "index.html"), join("dist", "404.html"));
