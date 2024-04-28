import { readFile } from "node:fs/promises";

const path =
  "node_modules/@cortex-js/compute-engine/dist/compute-engine.min.esm.js";

const originalContents = await readFile(path, "utf-8");
const newContents = originalContents.replace(
  /(function (\w+)\((\w+),(\w+)\){)(if\(\4>3.+?)(return["']quotient["']})/,
  "$1/*$5*/$6"
);

// For some reason, updating ComputeEngine.latexOptions.fractionStyle causes
// our custom latexDictionary entries to be ignored. This is a workaround to
// override the default fraction style to always use the "quotient" style.
// This avoids issues with some fractions serializing as "a/b", which is not
// supported by Desmos.

await Bun.write(path, newContents);
