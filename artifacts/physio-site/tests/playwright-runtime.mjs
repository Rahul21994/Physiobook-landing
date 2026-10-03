import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

export function exposeNixBrowserLibraries() {
  if (process.platform !== "linux") return;

  const configuredLibraryPaths = (process.env.LD_LIBRARY_PATH ?? "")
    .split(path.delimiter)
    .filter(Boolean);
  if (
    configuredLibraryPaths.some((libraryPath) =>
      existsSync(path.join(libraryPath, "libgbm.so.1")),
    )
  ) {
    return;
  }

  const runtimeDirectory = "/repl/ctls";
  if (!existsSync(runtimeDirectory)) return;

  const mesaDirectory = readdirSync(runtimeDirectory).find((entry) =>
    entry.includes("-mesa-libgbm-"),
  );
  if (!mesaDirectory) return;

  const mesaLibraryPath = path.join(runtimeDirectory, mesaDirectory, "lib");
  if (!existsSync(path.join(mesaLibraryPath, "libgbm.so.1"))) return;

  process.env.LD_LIBRARY_PATH = [
    mesaLibraryPath,
    ...configuredLibraryPaths,
  ].join(path.delimiter);
}