import * as fs from "fs/promises";
import { createWriteStream } from "node:fs";
import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import * as path from "node:path";
import archiver from "archiver";
import config from "./config.json" with { type: "json" };

const minecraftDirectory = config["com.mojang"];
const name = config.name;
const bpOnly = config.bpOnly;
let mode = process.argv[2];
if (mode === undefined || (mode !== "build" && mode !== "pack" && mode !== "copy")) mode = "build";

const plugins = [typescript()];

const build = await rollup({
  input: "src/main.ts",
  external: ["@minecraft/server", "@minecraft/server-ui"],
  plugins,
});

await build.write({
  format: "es",
  dir: "bp/scripts",
});

console.log(`Built ${name} Scripts to bp/scripts`);

async function zipPacks(zipPath, includeRP) {
  const output = createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });
  return new Promise((resolve, reject) => {
    output.on("close", () => resolve());
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory("bp", `${name}_BP`);
    if (includeRP) archive.directory("rp", `${name}_RP`);
    archive.finalize();
  });
}

if (mode === "pack") {
  const zipName = `${name}.zip`;
  const mcpackName = `${name}.mcpack`;
  await fs.rm(zipName, { force: true });
  await fs.rm(mcpackName, { force: true });
  await zipPacks(zipName, !bpOnly);
  await fs.rename(zipName, mcpackName);
  console.log(`Packaged ${name} into ${mcpackName}`);
}

if (minecraftDirectory && mode === "copy") {
  await Promise.all([
    fs.rm(path.join(minecraftDirectory, "development_behavior_packs", name), { recursive: true, force: true }),
    ...(!bpOnly ? [fs.rm(path.join(minecraftDirectory, "development_resource_packs", name), { recursive: true, force: true })] : []),
  ]);
  await Promise.all([
    fs.cp("bp", path.join(minecraftDirectory, "development_behavior_packs", name), { recursive: true }),
    ...(!bpOnly ? [fs.cp("rp", path.join(minecraftDirectory, "development_resource_packs", name), { recursive: true })] : []),
  ]);

  console.log(`Copied ${name} Behavior Pack to ${path.join(minecraftDirectory, "development_behavior_packs", name)}`);
  if (!bpOnly) {
    console.log(`Copied ${name} Resource Pack to ${path.join(minecraftDirectory, "development_resource_packs", name)}`);
  }
}
