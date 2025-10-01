# Minecraft Bedrock Add-On Build System

This npm project automates the TypeScript compilation process so you don’t need to manually run `tsc` every time you make changes.  
It also automatically copies the packs into the correct Minecraft `com.mojang` directories.

---

## Requirements

You must have a recent version of [Npm and Node](https://nodejs.org/en) installed to run this project.  
Npm is usually installed alongside Node.


---

## Installation

To ensure all required files are installed run: `npm install`

---

## Project Structure

- **`src/main.ts`** → Main entrypoint for all scripts. Write your TypeScript code here.  
- **`bp/scripts`** → Compiled scripts are output here. **Do not edit directly.**  
- **`bp`** → Behavior Pack files (safe to edit).  
- **`rp`** → Resource Pack files (safe to edit).

---

## Config

Before running make sure you've specified the correct configuration options.

Go to the `config.json` to control:  
- **`com.mojang`** — specify your Minecraft Bedrock directory (com.mojang directory) for example `C:/Users/<PCNAME>/AppData/Local/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang`
  - Set **false** to disable  
- **`name`** — Specify folder name used for add-on  
- **`bpOnly`** — Set to `true` if you only want the Behavior Pack copied (skips Resource Pack)


## Running

There are four main commands you can use:

- **Development with hot reloading**  
`npm run dev` 
  Runs continuously, rebuilding whenever files change.
  Keep this running for the duration of your development session.

- **Build only**  
`npm run build`
  Compiles the TypeScript files into JavaScript without copying into Minecraft.

- **Copy Packs**  
`npm run copy`
  Runs the Rollup build and copies the packs into your `com.mojang` directory (no watching).

- **Pack**  
`npm run pack`
  Creates a .mcpack in the root folder.

---

## Notes

- All commands will complie your scripts. Only 1 (Copy) will copy over the files into the dev pack folders.
- Do not modify files in `bp/scripts` directly; they will be overwritten on every build.  
- Always edit TypeScript in `src` and pack assets in `bp`/`rp`.  
- If automatic copying is disabled, you can manually copy the built packs into your Minecraft `development_behavior_packs` and `development_resource_packs` folders.  
